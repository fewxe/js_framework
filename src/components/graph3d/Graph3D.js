import React, { Component } from 'react';
import Point from '../../modules/graph3d/Math3D/entities/Point.js';
import Cube from '../../modules/graph3d/Math3D/figurs/Cube.js';
import Cylinder from '../../modules/graph3d/Math3D/figurs/Cylinder.js';
import Sphere from '../../modules/graph3d/Math3D/figurs/Sphere.js';
import Math3D from '../../modules/graph3d/Math3D.js';
import Canvas from '../../modules/Canvas/Canvas.js';
import Light from '../../modules/graph3d/Math3D/entities/Light.js';

window.requestAnyFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000/60);
        };
})();

export default class Graph3D extends Component {
    constructor(props) {
        super(props);

        this.WIN = {
            LEFT: -5,
            BOTTOM: -5,
            WIDTH: 10,
            HEIGHT: 10,
            CENTER: new Point(0, 0, 30),
            CAMERA: new Point(0, 0, 50),
            LIGHT: new Light(-40, 5, 10, 25000),
        };

        this.state = {
            scene: new Cube(),
            canRotate: false,
            dx: 0,
            dy: 0,
            printPolygons: true,
            printPoint: true,
            printEdges: true,
            fps: 0
        };

        this.math3D = new Math3D({ WIN: this.WIN });
        this.figures = {
            cube: () => new Cube(),
            cylinder: () => new Cylinder(),
            sphere: () => new Sphere(),
        };
        
        this.mainCanvas = null;
        this.virtualCanvas = null;
        this.reqId = null;
        this.pendingFrame = false;
        this.lastFpsUpdate = Date.now();
        this.frameCount = 0;
    }

    componentDidMount() {
        this.mainCanvas = new Canvas({
            WIN: this.WIN,
            id: 'canvas3D',
            width: 700,
            height: 700,
            callbacks: {
                wheel: this.handleWheel.bind(this),
                mousemove: this.handleMouseMove.bind(this),
                mouseup: this.handleMouseUp.bind(this),
                mousedown: this.handleMouseDown.bind(this),
                mouseleave: this.handleMouseLeave.bind(this),
            },
        });

        const virtualCanvasElement = document.createElement('canvas');
        this.virtualCanvas = new Canvas({
            WIN: this.WIN,
            canvas: virtualCanvasElement,
            width: this.mainCanvas.canvas.width,
            height: this.mainCanvas.canvas.height
        });

        this.startAnimationLoop();
    }

    componentWillUnmount() {
        if (this.reqId) {
            window.cancelAnimationFrame(this.reqId);
        }
    }

    startAnimationLoop = () => {
        const loop = () => {
            const now = Date.now();
            this.frameCount++;
            
            if (now - this.lastFpsUpdate >= 1000) {
                this.setState({ fps: this.frameCount });
                this.frameCount = 0;
                this.lastFpsUpdate = now;
            }
            
            this.renderFrame();
            this.reqId = window.requestAnyFrame(loop);
        };
        
        this.reqId = window.requestAnyFrame(loop);
    };

    handleWheel = (event) => {
        const delta = event.wheelDelta > 0 ? 1.1 : 0.9;
        this.state.scene.points.forEach((point) => this.math3D.zoom(delta, point));
        this.scheduleRender();
    };

    handleMouseUp = () => {
        this.setState({ canRotate: false });
    };

    handleMouseLeave = () => {
        this.setState({ canRotate: false });
    };

    handleMouseDown = (event) => {
        this.setState({
            canRotate: true,
            dx: event.offsetX,
            dy: event.offsetY,
        });
    };

    handleMouseMove = (event) => {
        if (this.state.canRotate) {
            const ROTATION_SENSITIVITY = 5;
            const gradus = Math.PI / 180 / ROTATION_SENSITIVITY;

            this.state.scene.points.forEach((point) => {
                this.math3D.rotateOy(-(this.state.dx - event.offsetX) * gradus, point);
                this.math3D.rotateOx(-(this.state.dy - event.offsetY) * gradus, point);
            });

            this.setState({
                dx: event.offsetX,
                dy: event.offsetY,
            });

            this.scheduleRender();
        }
    };

    scheduleRender = () => {
        if (!this.pendingFrame) {
            this.pendingFrame = true;
            window.requestAnyFrame(() => {
                this.renderFrame();
                this.pendingFrame = false;
            });
        }
    };

    renderFrame() {
        const { scene } = this.state;
        if (!scene.points.length || !scene.polygons.length) return;

        this.virtualCanvas.clear();
        this.mainCanvas.clear();

        this.math3D.calcDistance(scene, this.WIN.CAMERA, 'distance');
        this.math3D.sortByArtistAlgorithm(scene.polygons);
        this.math3D.calcDistance(scene, this.WIN.LIGHT, 'lumen');

        if (this.state.printPolygons) {
            scene.polygons.forEach((polygon) => {
                const points = polygon.points.map((index) => scene.points[index]);
                const projectedPoints = points.map((point) => ({
                    x: this.math3D.xs(point),
                    y: this.math3D.ys(point),
                }));
                const lumen = this.math3D.calcIllumination(polygon.lumen, this.WIN.LIGHT.lumen);

                let { r, g, b } = polygon.color;
                r = Math.round(r * lumen);
                g = Math.round(g * lumen);
                b = Math.round(b * lumen);

                this.virtualCanvas.polygon(projectedPoints, polygon.rgbToHex(r, g, b));
            });
        }

        if (this.state.printEdges) {
            scene.edges.forEach((edge) => {
                const p1 = scene.points[edge.p1];
                const p2 = scene.points[edge.p2];
                this.virtualCanvas.line(
                    this.math3D.xs(p1),
                    this.math3D.ys(p1),
                    this.math3D.xs(p2),
                    this.math3D.ys(p2)
                );
            });
        }

        if (this.state.printPoint) {
            scene.points.forEach((point) => {
                this.virtualCanvas.point(this.math3D.xs(point), this.math3D.ys(point));
            });
        }

        this.mainCanvas.context.drawImage(
            this.virtualCanvas.canvas,
            0, 0,
            this.virtualCanvas.canvas.width,
            this.virtualCanvas.canvas.height,
            0, 0,
            this.mainCanvas.canvas.width,
            this.mainCanvas.canvas.height
        );

        this.mainCanvas.text(
            `FPS: ${this.state.fps}`,
            this.WIN.LEFT,
            this.WIN.BOTTOM + this.WIN.HEIGHT - 1 ,
            "red"
        );
    }

    render() {
        return (
            <div>
                <canvas id="canvas3D"></canvas>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={this.state.printPolygons}
                            onChange={(e) => this.setState({ printPolygons: e.target.checked })}
                        />
                        Отобразить полигоны
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={this.state.printPoint}
                            onChange={(e) => this.setState({ printPoint: e.target.checked })}
                        />
                        Отобразить точки
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={this.state.printEdges}
                            onChange={(e) => this.setState({ printEdges: e.target.checked })}
                        />
                        Отобразить ребра
                    </label>

                    <select
                        onChange={(e) => this.setState({ scene: this.figures[e.target.value]() })}
                    >
                        <option value="cube">Cube</option>
                        <option value="cylinder">Cylinder</option>
                        <option value="sphere">Sphere</option>
                    </select>
                </div>
            </div>
        );
    }
}
