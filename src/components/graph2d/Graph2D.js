import { useEffect, useRef, useState } from 'react';
import useCanvas from '../../hooks/useCanvas.js';
import Canvas from '../../modules/Canvas/Canvas.js';
import Graph from '../../modules/graph2d/Graph.js';
import UI2D from './UI2D';

const Graph2D = () => {
    const [functions, setFunctions] = useState([]);
    const canvasRef = useRef(null);
    const graphRef = useRef(null);

    const renderFrame = (fps) => {
        graphRef.current.clear();
        graphRef.current.drawGrid();
        functions.forEach(f => {
            try {
                const func = new Function('x', `return ${f.funcStr}`);
                graphRef.current.drawFunction(func, f.color || '#ff0000');
                if (f.integralRange?.[0] !== '' && f.integralRange?.[1] !== '') {
                    graphRef.current.drawIntegral(func, Number(f.integralRange[0]), Number(f.integralRange[1]));
                }
                if (f.tangentPoint !== '') {
                    graphRef.current.drawTangentWithDerivative(func, Number(f.tangentPoint));
                }
                if (f.zeroRange?.[0] !== '' && f.zeroRange?.[1] !== '') {
                    graphRef.current.drawZeroPoints(func, Number(f.zeroRange[0]), Number(f.zeroRange[1]));
                }
            } catch {}
        });

        if (graphRef.current._canvas && graphRef.current._canvas.text) {
            const win = graphRef.current._canvas.WIN;
            graphRef.current._canvas.text(
                `FPS: ${fps}`,
                win.LEFT,
                win.BOTTOM + win.HEIGHT - 5,
                "red"
            );
        }
    };

    const [startRender, stopRender] = useCanvas(renderFrame);

    useEffect(() => {
        if (!graphRef.current && canvasRef.current) {
            const canvasApi = new Canvas({
                canvas: canvasRef.current,
                width: 800,
                height: 600,
                WIN: { LEFT: -40, BOTTOM: -30, WIDTH: 80, HEIGHT: 60 },
                callbacks: {
                    wheel: e => {
                        e.preventDefault();
                        graphRef.current.zoom(e.deltaY < 0 ? 1.1 : 0.9);
                    },
                    mousedown: e => {
                        canvasRef.current._move = { x: e.offsetX, y: e.offsetY, active: true };
                    },
                    mouseup: () => {
                        if (canvasRef.current._move) canvasRef.current._move.active = false;
                    },
                    mouseleave: () => {
                        if (canvasRef.current._move) canvasRef.current._move.active = false;
                    },
                    mousemove: e => {
                        const m = canvasRef.current._move;
                        if (m && m.active) {
                            graphRef.current.offsetX += (e.offsetX - m.x) / graphRef.current.scale;
                            graphRef.current.offsetY -= (e.offsetY - m.y) / graphRef.current.scale;
                            m.x = e.offsetX;
                            m.y = e.offsetY;
                        }
                    }
                }
            });
            graphRef.current = new Graph(canvasApi);
        }
        startRender();
        return stopRender;
    }, [startRender, stopRender]);

    const handleAdd = () => setFunctions(f => [...f, { funcStr: '', color: '#ff0000' }]);
    const handleUpdate = (i, data) => setFunctions(f => f.map((el, idx) => idx === i ? { ...el, ...data } : el));
    const handleRemove = i => setFunctions(f => f.filter((_, idx) => idx !== i));

    return (
        <div>
            <canvas ref={canvasRef} id="canvas2D" width="800" height="600"></canvas>
            <UI2D
                functions={functions}
                onAdd={handleAdd}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
            />
        </div>
    );
};

export default Graph2D;
