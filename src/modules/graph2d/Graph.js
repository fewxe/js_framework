import './myMath.js';

export default class Graph {
    constructor(canvasApi, scale = 10) {
        this._canvas = canvasApi;
        this.scale = scale;
        this.offsetX = 0;
        this.offsetY = 0;
        this.canvas = this._canvas.canvas;
    }

    zoom(factor) {
        this.scale *= factor;
    }

    drawZeroPoints(func, a, b, step = 0.1, eps = 0.0001, color = "red", size = 5) {
        for (let x = a; x < b; x += step) {
            let zero = Math.getZero(func, x, x + step, eps);
            if (zero !== null) {
                this._canvas.point(
                    zero * this.scale + this.offsetX * this.scale,
                    0 * this.scale + this.offsetY * this.scale,
                    color,
                    size
                );
            }
        }
    }

    drawFunction(func, color = "blue") {
        let startX = -this.canvas.width / 2 / this.scale;
        let endX = this.canvas.width / 2 / this.scale;
        let delta = 1 / this.scale;

        let x1 = startX;
        let y1 = func(x1);
        for (let x2 = startX + delta; x2 <= endX; x2 += delta) {
            let y2 = func(x2);
            let sx1 = x1 * this.scale + this.offsetX * this.scale;
            let sy1 = (y1 + this.offsetY) * this.scale;
            let sx2 = x2 * this.scale + this.offsetX * this.scale;
            let sy2 = (y2 + this.offsetY) * this.scale;
            this._canvas.line(sx1, sy1, sx2, sy2, color, 2);
            x1 = x2;
            y1 = y2;
        }
    }

    drawIntegral(func, a, b, color = "pink") {
        let points = [];
        for (let x = a; x <= b; x += 1 / this.scale) {
            points.push({
                x: x * this.scale + this.offsetX * this.scale,
                y: (func(x) + this.offsetY) * this.scale
            });
        }
        points.push({ x: b * this.scale + this.offsetX * this.scale, y: (0 + this.offsetY) * this.scale });
        points.push({ x: a * this.scale + this.offsetX * this.scale, y: (0 + this.offsetY) * this.scale });
        this._canvas.polygon(points, color);
    }

    drawTangentWithDerivative(func, x0) {
        let derivative = Math.getDerivativeAtPoint(func, x0);
        const tangent = x => derivative * (x - x0) + func(x0);
        this.drawFunction(tangent, 'green');
    }

    drawGrid(color = "#cccccc", step = 1) {
        let startX = -this.canvas.width / 2 / this.scale;
        let endX = this.canvas.width / 2 / this.scale;
        let startY = -this.canvas.height / 2 / this.scale;
        let endY = this.canvas.height / 2 / this.scale;

        for (let x = Math.ceil(startX); x <= endX; x += step) {
            let sx = x * this.scale + this.offsetX * this.scale;
            this._canvas.line(
                sx, (startY + this.offsetY) * this.scale,
                sx, (endY + this.offsetY) * this.scale,
                color, 1
            );
            this._canvas.text(
                x, sx, (0 + this.offsetY) * this.scale, 'black'
            );
        }
        for (let y = Math.ceil(startY); y <= endY; y += step) {
            if (y === 0) continue;
            let sy = (y + this.offsetY) * this.scale;
            this._canvas.line(
                (startX * this.scale + this.offsetX * this.scale), sy,
                (endX * this.scale + this.offsetX * this.scale), sy,
                color, 1
            );
            this._canvas.text(
                y, (0 + this.offsetX) * this.scale, sy, 'black'
            );
        }
        this._canvas.line(
            (0 + this.offsetX) * this.scale, (startY + this.offsetY) * this.scale,
            (0 + this.offsetX) * this.scale, (endY + this.offsetY) * this.scale,
            'black', 2
        );
        this._canvas.line(
            (startX * this.scale + this.offsetX * this.scale), (0 + this.offsetY) * this.scale,
            (endX * this.scale + this.offsetX * this.scale), (0 + this.offsetY) * this.scale,
            'black', 2
        );
    }

    clear() {
        this._canvas.clear();
    }
}

