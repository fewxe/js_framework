import React, { useEffect, useRef } from 'react';
import Graph3DMain from './Graph3DMain';

export default function Graph3DComponent() {
    const canvasId = 'canvas3D';
    const mainRef = useRef(null);

    useEffect(() => {
        mainRef.current = new Graph3DMain(canvasId); // Убедитесь, что используется new
        const graph3D = mainRef.current.run();

        return () => {
            // Очистка ресурсов, если необходимо
        };
    }, []);

    return (
        <div>
            <canvas id={canvasId} width="700" height="700"></canvas>
            <div>
                <label>
                    <input type="checkbox" id="printPolygons" defaultChecked /> Полигоны
                </label>
                <label>
                    <input type="checkbox" id="printPoint" defaultChecked /> Точки
                </label>
                <label>
                    <input type="checkbox" id="printEdges" defaultChecked /> Грани
                </label>
            </div>
            <select id="listFigure">
                <option value="cube">Куб</option>
                <option value="cylinder">Цилиндр</option>
                <option value="sphere">Сфера</option>
            </select>
        </div>
    );
}
