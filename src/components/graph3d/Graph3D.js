import { useEffect, useRef, useState } from 'react';
import useCanvas from '../../hooks/useCanvas.js';
import Canvas from '../../modules/Canvas/Canvas.js';
import Math3D from '../../modules/graph3d/Math3D.js';
import Light from '../../modules/graph3d/Math3D/entities/Light.js';
import Point from '../../modules/graph3d/Math3D/entities/Point.js';
import Cone from '../../modules/graph3d/Math3D/figurs/cone.js';
import Cube from '../../modules/graph3d/Math3D/figurs/Cube.js';
import Cylinder from '../../modules/graph3d/Math3D/figurs/Cylinder.js';
import Ellipsoid from '../../modules/graph3d/Math3D/figurs/ellipsoid.js';
import EllipticalCylinder from '../../modules/graph3d/Math3D/figurs/ellipticalCylinder.js';
import EllipticalParaboloid from '../../modules/graph3d/Math3D/figurs/ellipticalParaboloid.js';
import HyperbolicCylinder from '../../modules/graph3d/Math3D/figurs/hyperboliccylinder.js';
import HyperbolicParaboloid from '../../modules/graph3d/Math3D/figurs/hyperbolicParaboloid.js';
import OneSheetedHyperboloid from '../../modules/graph3d/Math3D/figurs/oneSheetedHyperboloid.js';
import ParabolicCylinder from '../../modules/graph3d/Math3D/figurs/paraboliccylinder.js';
import Sphere from '../../modules/graph3d/Math3D/figurs/Sphere.js';
import Torus from '../../modules/graph3d/Math3D/figurs/Torus.js';
import TwoSheetedHyperboloid from '../../modules/graph3d/Math3D/figurs/twoSheetedHyperboloid.js';

const WIN = {
  LEFT: -5,
  BOTTOM: -5,
  WIDTH: 10,
  HEIGHT: 10,
  CENTER: new Point(0, 0, 30),
  CAMERA: new Point(0, 0, 50),
  LIGHT: new Light(-40, 5, 10, 25000),
};

const figuresMap = {
  cube: () => new Cube(),
  cylinder: () => new Cylinder(),
  sphere: () => new Sphere(),
  torus: () => new Torus(),
  ellipsoid: () => new Ellipsoid(),
  cone: () => new Cone(),
  paraboliccylinder: () => new ParabolicCylinder(),
  hyperboliccylinder: () => new HyperbolicCylinder(),
  ellipticalCylinder: () => new EllipticalCylinder(),
  ellipticalParaboloid: () => new EllipticalParaboloid(),
  oneSheetedHyperboloid: () => new OneSheetedHyperboloid(),
  twoSheetedHyperboloid: () => new TwoSheetedHyperboloid(),
  hyperbolicParaboloid: () => new HyperbolicParaboloid(),
};

const figureNames = [
  { value: 'cube', label: 'Cube' },
  { value: 'cylinder', label: 'Cylinder' },
  { value: 'sphere', label: 'Sphere' },
  { value: 'torus', label: 'Torus' },
  { value: 'ellipsoid', label: 'Ellipsoid' },
  { value: 'cone', label: 'Cone' },
  { value: 'paraboliccylinder', label: 'Parabolic Cylinder' },
  { value: 'hyperboliccylinder', label: 'Hyperbolic Cylinder' },
  { value: 'ellipticalCylinder', label: 'Elliptical Cylinder' },
  { value: 'ellipticalParaboloid', label: 'Elliptical Paraboloid' },
  { value: 'oneSheetedHyperboloid', label: 'One-Sheeted Hyperboloid' },
  { value: 'twoSheetedHyperboloid', label: 'Two-Sheeted Hyperboloid' },
  { value: 'hyperbolicParaboloid', label: 'Hyperbolic Paraboloid' },
];

const Graph3D = () => {
  const [printPolygons, setPrintPolygons] = useState(true);
  const [printPoint, setPrintPoint] = useState(true);
  const [printEdges, setPrintEdges] = useState(true);
  const [figureType, setFigureType] = useState('cube');

  const mainCanvasRef = useRef(null);
  const mainCanvasApiRef = useRef(null);

  const math3D = new Math3D({ WIN });
  const moveRef = useRef({ canRotate: false, dx: 0, dy: 0 });
  const sceneRef = useRef(figuresMap[figureType]());

  const [settingsHtml, setSettingsHtml] = useState('');

    useEffect(() => {
        sceneRef.current = figuresMap[figureType]();
        setSettingsHtml(sceneRef.current.settings());
    }, [figureType]);

  const handleMouseDown = e => {
    moveRef.current.canRotate = true;
    moveRef.current.dx = e.offsetX;
    moveRef.current.dy = e.offsetY;
  };

  const stopRotation = () => {
    moveRef.current.canRotate = false;
  };

  const handleMouseMove = e => {
    if (!moveRef.current.canRotate) return;

    const dx = e.offsetX;
    const dy = e.offsetY;
    const grad = Math.PI / 180 / 5;

    sceneRef.current.points.forEach(p => {
      math3D.rotateOy(-(moveRef.current.dx - dx) * grad, p);
      math3D.rotateOx(-(moveRef.current.dy - dy) * grad, p);
    });

    moveRef.current.dx = dx;
    moveRef.current.dy = dy;
  };

  const handleWheel = e => {
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    sceneRef.current.points.forEach(p => math3D.zoom(delta, p));
  };

  const render = fps => {
    const scene = sceneRef.current;

    const virtualCanvas = document.createElement('canvas');
    virtualCanvas.width = 700;
    virtualCanvas.height = 700;

    const virtualApi = new Canvas({ WIN, canvas: virtualCanvas, width: 700, height: 700 });

    virtualApi.clear();
    mainCanvasApiRef.current.clear();

    math3D.calcDistance(scene, WIN.CAMERA, 'distance');
    math3D.sortByArtistAlgorithm(scene.polygons);
    math3D.calcDistance(scene, WIN.LIGHT, 'lumen');

    if (printPolygons) {
      scene.polygons.forEach(polygon => {
        const points = polygon.points.map(i => scene.points[i]);
        const projected = points.map(p => ({
          x: math3D.xs(p),
          y: math3D.ys(p),
        }));
        const lumen = math3D.calcIllumination(polygon.lumen, WIN.LIGHT.lumen);
        const { r, g, b } = polygon.color;
        virtualApi.polygon(
          projected,
          polygon.rgbToHex(
            Math.round(r * lumen),
            Math.round(g * lumen),
            Math.round(b * lumen)
          )
        );
      });
    }

    if (printEdges) {
      scene.edges.forEach(edge => {
        const p1 = scene.points[edge.p1];
        const p2 = scene.points[edge.p2];
        virtualApi.line(math3D.xs(p1), math3D.ys(p1), math3D.xs(p2), math3D.ys(p2));
      });
    }

    if (printPoint) {
      scene.points.forEach(p =>
        virtualApi.point(math3D.xs(p), math3D.ys(p))
      );
    }

    mainCanvasApiRef.current.context.drawImage(
      virtualCanvas,
      0,
      0,
      virtualCanvas.width,
      virtualCanvas.height,
      0,
      0,
      mainCanvasApiRef.current.canvas.width,
      mainCanvasApiRef.current.canvas.height
    );

    mainCanvasApiRef.current.text(
      `FPS: ${fps}`,
      WIN.LEFT,
      WIN.BOTTOM + WIN.HEIGHT - 1,
      'red'
    );
  };

  const [startRender] = useCanvas(render);

  useEffect(() => {
    if (!mainCanvasApiRef.current && mainCanvasRef.current) {
      mainCanvasApiRef.current = new Canvas({
        WIN,
        canvas: mainCanvasRef.current,
        width: 700,
        height: 700,
        callbacks: {
          mousedown: handleMouseDown,
          mouseup: stopRotation,
          mouseleave: stopRotation,
          mousemove: handleMouseMove,
          wheel: handleWheel,
        },
      });
    }
    startRender();
  }, [startRender]);

  return (
    <div>
      <canvas ref={mainCanvasRef} width="700" height="700" />
      <div>
        <label>
          <input
            type="checkbox"
            checked={printPolygons}
            onChange={e => setPrintPolygons(e.target.checked)}
          />
          Полигоны
        </label>
        <label>
          <input
            type="checkbox"
            checked={printPoint}
            onChange={e => setPrintPoint(e.target.checked)}
          />
          Точки
        </label>
        <label>
          <input
            type="checkbox"
            checked={printEdges}
            onChange={e => setPrintEdges(e.target.checked)}
          />
          Ребра
        </label>
        <select
          value={figureType}
          onChange={e => setFigureType(e.target.value)}
        >
          {figureNames.map(figure => (
            <option key={figure.value} value={figure.value}>
              {figure.label}
            </option>
          ))}
        </select>
        <div>{settingsHtml}</div>
      </div>
    </div>
  );
};

export default Graph3D;
