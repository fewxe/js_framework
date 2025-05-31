import { useEffect, useRef } from 'react';
import useCanvas from '../../hooks/useCanvas.js';
import Canvas from '../../modules/Canvas/Canvas.js';
import Math3D from '../../modules/graph3d/Math3D.js';
import Light from '../../modules/graph3d/Math3D/entities/Light.js';
import Point from '../../modules/graph3d/Math3D/entities/Point.js';
import Cube from '../../modules/graph3d/Math3D/figurs/Cube.js';
import UI3D from './UI3D/UI3D.js';

const Graph3D = () => {
  const canvasRef = useRef(null);
  let canvas = null;

  const WIN = {
    LEFT: -5,
    BOTTOM: -5,
    WIDTH: 10,
    HEIGHT: 10, 
    CENTER: new Point(0, 0, 30),
    CAMERA: new Point(0, 0, 50),
    LIGHT: new Light(-40, 5, 10, 25000),
  };

  const math3D = new Math3D({ WIN });
  const moveRef = useRef({ canRotate: false, dx: 0, dy: 0 });

  const settings = {
    printPolygons: true,
    printPoint: true,
    printEdges: true,
    figures: [new Cube()],
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

    settings.figures.forEach(figure => {
      figure.localPoints.forEach(p => {
        math3D.rotateOy(-(moveRef.current.dx - dx) * grad, p);
        math3D.rotateOx(-(moveRef.current.dy - dy) * grad, p);
      });
    });

    moveRef.current.dx = dx;
    moveRef.current.dy = dy;
  };

  const handleWheel = e => {
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    settings.figures.forEach(figure => {
      figure.localPoints.forEach(p => math3D.zoom(delta, p));
    });
  };

  const render = fps => {
    canvas.clear();

    // 1. Считаем центры и радиусы для всех полигонов всех фигур (нужно для теней)
    settings.figures.forEach(figure => {
        math3D.calcRadius(figure);
        math3D.calcDistance(figure, WIN.CAMERA, 'distance');
        math3D.calcDistance(figure, WIN.LIGHT, 'lumen');
    });

    // 2. Собираем все полигоны всех фигур в один массив с привязкой к фигуре
    let allPolygons = [];
    settings.figures.forEach(figure => {
        figure.polygons.forEach(polygon => {
            allPolygons.push({ polygon, figure });
        });
    });

    // 3. Сортируем полигоны по алгоритму художника
    const sortedPolygons = math3D.sortByArtistAlgorithm(allPolygons.map(obj => obj.polygon));
    allPolygons = sortedPolygons.map(polygon =>
        allPolygons.find(obj => obj.polygon === polygon)
    );

    // 4. Отрисовываем полигоны с учётом теней
    if (settings.printPolygons) { 
        allPolygons.forEach(({ polygon, figure }) => {
            const points = polygon.points.map(i => figure.points[i]);
            const projected = points.map(p => ({
                x: math3D.xs(p),
                y: math3D.ys(p),
            }));
            const { isShadow, dark } = math3D.calcShadow(
                polygon,
                settings.figures,
                WIN.LIGHT
            );
            const lumen = math3D.calcIllumination(
                polygon.lumen,
                WIN.LIGHT.lumen * (isShadow ? dark : 1)
            );
            const { r, g, b } = polygon.color;
            canvas.polygon(
                projected,
                polygon.rgbToHex(
                    Math.round(r * lumen),
                    Math.round(g * lumen),
                    Math.round(b * lumen)
                )
            );
        });
    }

    // 5. Отрисовываем рёбра
    if (settings.printEdges) {
        settings.figures.forEach(figure => {
            figure.edges.forEach(edge => {
                const p1 = figure.points[edge.p1];
                const p2 = figure.points[edge.p2];
                canvas.line(math3D.xs(p1), math3D.ys(p1), math3D.xs(p2), math3D.ys(p2));
            });
        });
    }

    // 6. Отрисовываем точки
    if (settings.printPoint) {
        settings.figures.forEach(figure => {
            figure.points.forEach(p =>
                canvas.point(math3D.xs(p), math3D.ys(p))
            );
        });
    }

    canvas.text(
        `FPS: ${fps}`,
        WIN.LEFT,
        WIN.BOTTOM + WIN.HEIGHT - 1,
        'red'
    );

    canvas.drawTo();
  };

  const [startRender] = useCanvas(render);

  useEffect(() => {
    if (canvasRef.current && !canvas) {
      canvas = new Canvas({
        WIN,
        canvas: canvasRef.current,
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
      <canvas ref={canvasRef} width="700" height="700" />
      <UI3D settings={settings} WIN={WIN}/>
    </div>
  );
};

export default Graph3D;
