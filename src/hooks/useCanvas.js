import { useRef } from 'react';

const useCanvas = (renderFrame) => {
    const reqIdRef = useRef(null);
    const FPSRef = useRef(0);
    const countFPSRef = useRef(0);
    const lastTimestampRef = useRef(Date.now());

    const requestAnimFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) { return setTimeout(callback, 1000 / 60); };

    const loop = () => {
        countFPSRef.current++;
        const timestamp = Date.now();
        if (timestamp - lastTimestampRef.current >= 1000) {
            FPSRef.current = countFPSRef.current;
            countFPSRef.current = 0;
            lastTimestampRef.current = timestamp;
        }
        renderFrame(FPSRef.current);
        reqIdRef.current = requestAnimFrame(loop);
    };

    const startRender = () => {
        loop();
    };

    const stopRender = () => {
        if (reqIdRef.current) {
            window.cancelAnimationFrame(reqIdRef.current);
            reqIdRef.current = null;
        }
    };

    return [startRender, stopRender];
};

export default useCanvas;
