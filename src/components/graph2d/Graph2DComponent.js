import React, { useEffect, useRef } from 'react';
import Graph2DMain from './Graph2DMain';

export default function Graph2DComponent() {
    const canvasId = 'canvas';
    const containerId = 'ui-container';
    const mainRef = useRef(null);

    useEffect(() => {
        mainRef.current = new Graph2DMain(canvasId, containerId);
        const { controller } = mainRef.current.run();

        return () => {
            // Очистка ресурсов, если необходимо
        };
    }, []);

    return (
        <div>
            <canvas id={canvasId} width="800" height="600"></canvas>
            <div id={containerId}></div>
        </div>
    );
}
