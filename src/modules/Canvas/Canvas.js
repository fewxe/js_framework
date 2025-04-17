export default class Canvas {
    constructor({ WIN, id, width = 600, height = 600, callbacks = {} }) {
        this.WIN = WIN;
        this.canvas = document.getElementById(id);
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext(`2d`);
        this.canvas.addEventListener('wheel', callbacks.wheel);
        this.canvas.addEventListener('mousemove', callbacks.mousemove);
        this.canvas.addEventListener('mouseup', callbacks.mouseup);
        this.canvas.addEventListener('mousedown', callbacks.mousedown);
        this.canvas.addEventListener('mouseleave', callbacks.mouseleave);
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
        this.context.beginPath();
        this.context.strokeStyle = color || 'black';
        this.context.lineWidth = width || 4;
        this.context.moveTo(this.xs(x1), this.ys(y1));
        this.context.lineTo(this.xs(x2), this.ys(y2));
        this.context.closePath();
        this.context.stroke();
    }

    text(text, x, y, color) {
        this.context.fillStyle = color || '#000';
        this.context.font = '15px Arial';
        this.context.fillText(text, this.xs(x), this.ys(y));
    }

    point(x, y, color = 'red', size = 4) {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.fillStyle = color;
        this.context.arc(this.xs(x), this.ys(y), size, 0, Math.PI * 2);
        this.context.closePath();
        this.context.stroke();
        this.context.fill();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    polygon(points = [], color = '#F805') {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.fillStyle = color;
        this.context.moveTo(this.xs(points[0].x), this.ys(points[0].y));
        for (let i = 1; i < points.length; i++) {
            this.context.lineTo(this.xs(points[i].x), this.ys(points[i].y));
        }
        this.context.lineTo(this.xs(points[0].x), this.ys(points[0].y));
        this.context.closePath();
        this.context.fill();
    }

    tablet(x, y, color = 'red', size = 2, reverse) {
        size = size;
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.fillStyle = color;
        if (!reverse) {
            this.context.arc(this.xs(x), this.ys(y) + size, size, 0, Math.PI);
            this.context.arc(this.xs(x), this.ys(y) - size, size, Math.PI, Math.PI * 2);
        } else {
            this.context.arc(this.xs(x) + size, this.ys(y), size, -Math.PI * 0.5, Math.PI * 0.5);
            this.context.arc(this.xs(x) - size, this.ys(y), size, Math.PI * 0.5, -Math.PI * 0.5);
        }
        this.context.closePath();
        this.context.stroke();
        this.context.fill();
    }
    
}