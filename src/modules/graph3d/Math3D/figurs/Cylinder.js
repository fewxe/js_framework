import Edge from "../entities/Edge.js";
import Figure from "../entities/Figure.js";
import Point from "../entities/Point.js";
import Polygon from "../entities/Polygon.js";


export default class Cylinder extends Figure {
    constructor(origin = new Point(0, 0, 0), segments = 60, height = 5, radius = 5) {
        super(origin);
        this._segments = segments;
        this._height = height;
        this._radius = radius;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        this.updateGeometry();
    }

    get radius() {
        return this._radius;
    }

    set radius(value) {
        this._radius = value;
        this.updateGeometry();
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
        this.updateGeometry();
    }

    get segments() {
        return this._segments;
    }

    set segments(value) {
        this._segments = value;
        this.updateGeometry();
    }

    updateGeometry() {
        this.points = [];
        this.edges = [];
        this.polygons = [];
        const angleStep = (2 * Math.PI) / this._segments;
        // Верх и низ
        for (let level = -this._height; level <= this._height; level += this._height * 2) {
            for (let i = 0; i < this._segments; i++) {
                const angle = angleStep * i;
                this.points.push(new Point(
                    this._radius * Math.cos(angle),
                    this._radius * Math.sin(angle),
                    level
                ));
            }
        }
        // Рёбра боковой поверхности
        for (let i = 0; i < this._segments; i++) {
            this.edges.push(new Edge(i, (i + 1) % this._segments));
            this.edges.push(new Edge(
                i + this._segments,
                ((i + 1) % this._segments) + this._segments
            ));
        }
        // Рёбра между верхом и низом
        for (let i = 0; i < this._segments; i++) {
            this.edges.push(new Edge(i, i + this._segments));
        }
        // Боковые полигоны
        for (let i = 0; i < this._segments; i++) {
            const next = (i + 1) % this._segments;
            this.polygons.push(new Polygon([
                i,
                next,
                next + this._segments,
                i + this._segments
            ]));
        }
        // Верх и низ
        this.polygons.push(new Polygon(
            Array.from({ length: this._segments }, (_, i) => i)
        ));
        this.polygons.push(new Polygon(
            Array.from({ length: this._segments }, (_, i) => i + this._segments)
        ));
    }

    settings() {
        return (
            <div>
                <label>
                    Радиус:
                    <input
                        type="number"
                        defaultValue={this.radius}
                        onChange={e => { this.radius = parseFloat(e.target.value); }}
                    />
                </label>
                <label>
                    Высота:
                    <input
                        type="number"
                        defaultValue={this.height}
                        onChange={e => { this.height = parseFloat(e.target.value); }}
                    />
                </label>
                <label>
                    Сегменты:
                    <input
                        type="number"
                        defaultValue={this.segments}
                        onChange={e => { this.segments = parseInt(e.target.value, 10); }}
                    />
                </label>
            </div>
        );
    }
}