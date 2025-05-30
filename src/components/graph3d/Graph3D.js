import { useEffect, useRef } from 'react';
import useCanvas from '../../hooks/useCanvas.js';
import Canvas from '../../modules/Canvas/Canvas.js';
import Math3D from '../../modules/graph3d/Math3D.js';
import Light from '../../modules/graph3d/Math3D/entities/Light.js';
import Point from '../../modules/graph3d/Math3D/entities/Point.js';
import Cube from '../../modules/graph3d/Math3D/figurs/Cube.js';
import UI3D from './UI3D/UI3D.js';

const WIN = {
  LEFT: -5,
  BOTTOM: -5,
  WIDTH: 10,
  HEIGHT: 10, 
  CENTER: new Point(0, 0, 30),
  CAMERA: new Point(0, 0, 50),
  LIGHT: new Light(-40, 5, 10, 25000),
};


const Graph3D = () => {
  const mainCanvasRef = useRef(null);
  const mainCanvasApiRef = useRef(null);

  const math3D = new Math3D({ WIN });
  const moveRef = useRef({ canRotate: false, dx: 0, dy: 0 });

  const settings = {
    printPolygons: true,
    printPoint: true,
    printEdges: true,
    figure: new Cube(),
  }

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

    settings.figure.points.forEach(p => {
      math3D.rotateOy(-(moveRef.current.dx - dx) * grad, p);
      math3D.rotateOx(-(moveRef.current.dy - dy) * grad, p);
    });

    moveRef.current.dx = dx;
    moveRef.current.dy = dy;
  };

  const handleWheel = e => {
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    settings.figure.current.points.forEach(p => math3D.zoom(delta, p));
  };

  const render = fps => {
    const figure = settings.figure;
    if (!figure) return;

    const virtualCanvas = document.createElement('canvas');
    virtualCanvas.width = 700;
    virtualCanvas.height = 700;

    const virtualApi = new Canvas({ WIN, canvas: virtualCanvas, width: 700, height: 700 });

    virtualApi.clear();
    mainCanvasApiRef.current.clear();

    math3D.calcDistance(figure, WIN.CAMERA, 'distance');
    math3D.sortByArtistAlgorithm(figure.polygons);
    math3D.calcDistance(figure, WIN.LIGHT, 'lumen');

    if (settings.printPolygons) {
      settings.figure.polygons.forEach(polygon => {
        const points = polygon.points.map(i => figure.points[i]);
        const projected = points.map(p => ({
          x: math3D.xs(p),
          y: math3D.ys(p),
        }));
        const { isShadow, dark } = math3D.calcShadow(
          polygon, 
          settings.figure, 
          WIN.LIGHT
        );
        const lumen = math3D.calcIllumination(polygon.lumen, WIN.LIGHT.lumen * (isShadow ? dark : 1));
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

    if (settings.printEdges) {
      figure.edges.forEach(edge => {
        const p1 = figure.points[edge.p1];
        const p2 = figure.points[edge.p2];
        virtualApi.line(math3D.xs(p1), math3D.ys(p1), math3D.xs(p2), math3D.ys(p2));
      });
    }

    if (settings.printPoint) {
      figure.points.forEach(p =>
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
      <UI3D settings={settings}/>
    </div>
  );
};

export default Graph3D;
