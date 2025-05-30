export default class Canvas {
    constructor({ WIN, id = null, width = 600, height = 600, callbacks = {}, canvas }) {
        this.WIN = WIN;
        this.canvas = canvas;
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext(`2d`);
        this.canvas.addEventListener('wheel', callbacks.wheel);
        this.canvas.addEventListener('mousemove', callbacks.mousemove);
        this.canvas.addEventListener('mouseup', callbacks.mouseup);
        this.canvas.addEventListener('mousedown', callbacks.mousedown);
        this.canvas.addEventListener('mouseleave', callbacks.mouseleave);

        this.virtualCanvas = document.createElement('canvas');
        this.virtualCanvas.width = width;
        this.virtualCanvas.height = height;
        this.contextV = this.virtualCanvas.getContext(`2d`);
    }

    xs(x) {
        return this.canvas.width * (x - this.WIN.LEFT) / this.WIN.WIDTH
    }
    ys(y) {
        return this.canvas.height - (this.canvas.height * (y - this.WIN.BOTTOM) / this.WIN.HEIGHT)
    }

    sx(x) {
        return this.WIN.WIDTH * x / this.canvas.width;
    }
    sy(y) {
        return this.WIN.HEIGHT * y / this.canvas.height;
    }

    line(x1, y1, x2, y2, color, width) {
        this.contextV.beginPath();
        this.contextV.strokeStyle = color || 'black';
        this.contextV.lineWidth = width || 4;
        this.contextV.moveTo(this.xs(x1), this.ys(y1));
        this.contextV.lineTo(this.xs(x2), this.ys(y2));
        this.contextV.closePath();
        this.contextV.stroke();
    }

    text(text, x, y, color) {
        this.contextV.fillStyle = color || '#000';
        this.contextV.font = '15px Arial';
        this.contextV.fillText(text, this.xs(x), this.ys(y));
    }

    point(x, y, color = 'red', size = 4) {
        this.contextV.beginPath();
        this.contextV.strokeStyle = color;
        this.contextV.fillStyle = color;
        this.contextV.arc(this.xs(x), this.ys(y), size, 0, Math.PI * 2);
        this.contextV.closePath();
        this.contextV.stroke();
        this.contextV.fill();
    }

    clearV() {
        this.contextV.clearRect(0, 0, this.virtualCanvas.width, this.virtualCanvas.height);
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    polygon(points = [], color = '#F805') {
        this.contextV.beginPath();
        this.contextV.strokeStyle = color;
        this.contextV.fillStyle = color;
        this.contextV.moveTo(this.xs(points[0].x), this.ys(points[0].y));
        for (let i = 1; i < points.length; i++) {
            this.contextV.lineTo(this.xs(points[i].x), this.ys(points[i].y));
        }
        this.contextV.lineTo(this.xs(points[0].x), this.ys(points[0].y));
        this.contextV.closePath();
        this.contextV.fill();
    }

    tablet(x, y, color = 'red', size = 2, reverse) {
        this.contextV.beginPath();
        this.contextV.strokeStyle = color;
        this.contextV.fillStyle = color;
        if (!reverse) {
            this.contextV.arc(this.xs(x), this.ys(y) + size, size, 0, Math.PI);
            this.contextV.arc(this.xs(x), this.ys(y) - size, size, Math.PI, Math.PI * 2);
        } else {
            this.contextV.arc(this.xs(x) + size, this.ys(y), size, -Math.PI * 0.5, Math.PI * 0.5);
            this.contextV.arc(this.xs(x) - size, this.ys(y), size, Math.PI * 0.5, -Math.PI * 0.5);
        }
        this.contextV.closePath();
        this.contextV.stroke();
        this.contextV.fill();
    }

    drawTo() {
        this.clear();
        this.context.drawImage(
            this.virtualCanvas,
            0,
            0,
            this.virtualCanvas.width,
            this.virtualCanvas.height,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        this.clearV();
    }
}