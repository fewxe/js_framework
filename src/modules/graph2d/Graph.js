import './myMath.js';

export default class Graph {
    constructor(canvas, scale = 10) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.scale = scale;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    #sX(x) {
        return (this.canvas.width / 2) + (x + this.offsetX) * this.scale;
    }

    #sY(y) {
        return (this.canvas.height / 2) - (y + this.offsetY) * this.scale;
    }

    #toCartesianX(x) {
        return ((x - this.canvas.width / 2) / this.scale) - this.offsetX;
    }

    #toCartesianY(y) {
        return ((this.canvas.height / 2 - y) / this.scale) - this.offsetY;
    }

    #drawLine(x1, y1, x2, y2, color = 'black', width = 2) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.moveTo(this.#sX(x1), this.#sY(y1));
        this.ctx.lineTo(this.#sX(x2), this.#sY(y2));
        this.ctx.closePath();
        this.ctx.stroke();
    }

    #drawPoint(x, y, color, size) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.arc(this.#sX(x), this.#sY(y), size, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();
    }

    drawZeroPoints(func, a, b, step = 0.1, eps = 0.0001, color = "red", size = 5) {
        for (let x = a; x < b; x += step) {
            let zero = Math.getZero(func, x, x + step, eps);
            if (zero !== null) {
                this.#drawPoint(zero, 0, color, 5);
            }
        }
    }

    drawFunction(func, color = "blue") {
        let startX = this.#toCartesianX(0);
        let endX = this.#toCartesianX(this.canvas.width);
        let delta = 1 / this.scale;

        for (let x = startX; x <= endX; x += delta) {
            let x1 = x;
            let y1 = func(x1);
            let x2 = x + delta;
            let y2 = func(x2);
            this.#drawLine(x1, y1, x2, y2, color, 2);
        }
    }

    #polygon(points = [], color) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.moveTo(this.#sX(points[0].x), this.#sY(points[0].y));

        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(this.#sX(points[i].x), this.#sY(points[i].y));
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    drawIntegral(func, a, b, color = "pink") {
        let points = [];

        for (let x = a; x <= b; x += 1 / this.scale) {
            let y = func(x);
            points.push({ x, y });
        }

        points.push({ x: b, y: 0 });
        points.push({ x: a, y: 0 });

        this.#polygon(points, color);
    }

    drawTangentWithDerivative(func, x0) {
        let derivative = Math.getDerivativeAtPoint(func, x0);
        const tangent = x => derivative * (x - x0) + func(x0);
        this.drawFunction(tangent, 'green')
    }   
    
    // TODO: рисование стрело работает не корректно
    // #drawArrow(x2, y2, color = 'black') {
    //     this.#drawLine(
    //         x2, y2,
    //         x2 - Math.cos(Math.PI / 4),
    //         y2 - Math.sin(Math.PI / 4),
    //         color
    //     );
        
    //     this.#drawLine(
    //         x2, y2,
    //         x2 - Math.cos(-Math.PI / 4),
    //         y2 - Math.sin(-Math.PI / 4),
    //         color
    //     );
    // }

    drawGrid(color = "#cccccc", step = 1) {
        let startX = Math.floor(this.#toCartesianX(0));
        let endX = Math.floor(this.#toCartesianX(this.canvas.width));

        for (let x = startX; x <= endX; x += step) {
            this.#drawLine(x, this.#toCartesianY(0), x, this.#toCartesianY(this.canvas.height), color);
            this.ctx.fillText(x, this.#sX(x) + 5, this.#sY(0) + 15);
        }

        let startY = Math.floor(this.#toCartesianY(this.canvas.height));
        let endY = Math.floor(this.#toCartesianY(0));

        for (let y = startY; y <= endY; y += step) {
            if (y === 0) continue;
            this.#drawLine(this.#toCartesianX(0), y, this.#toCartesianX(this.canvas.width), y, color);
            this.ctx.fillText(y, this.#sX(0) + 5, this.#sY(y) - 5);
        }

        this.#drawLine(0, this.#toCartesianY(0), 0, this.#toCartesianY(this.canvas.height), 'black');
        this.#drawLine(this.#toCartesianX(0), 0, this.#toCartesianX(this.canvas.width), 0, 'black');

        // TODO: стрелки
        // this.#drawArrow(0, this.#toCartesianY(0), 'black');
        // this.#drawArrow(this.#toCartesianX(this.canvas.width), 0, 'black');

    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}

