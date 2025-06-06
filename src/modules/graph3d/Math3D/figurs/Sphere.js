import Edge from '../entities/Edge.js';
import Figure from '../entities/Figure.js';
import Point from '../entities/Point.js';
import Polygon from '../entities/Polygon.js';

export default class Sphere extends Figure {
    constructor(origin = new Point(0, 0, 0), radius = 10, count = 25) {
        super(origin);
        this._radius = radius;
        this._count = count;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        this.updateGeometry();
    }

    get radius() { return this._radius; }
    set radius(value) { this._radius = value; this.updateGeometry(); }
    get count() { return this._count; }
    set count(value) { this._count = value; this.updateGeometry(); }

    updateGeometry() {
        this.points = [];
        this.edges = [];
        this.polygons = [];
        for (let i = 0; i <= this._count; i++) {
            const theta = Math.PI * i / this._count;
            for (let j = 0; j <= this._count; j++) {
                const phi = 2 * Math.PI * j / this._count;
                const x = this._radius * Math.sin(theta) * Math.cos(phi);
                const y = this._radius * Math.sin(theta) * Math.sin(phi);
                const z = this._radius * Math.cos(theta);
                this.points.push(new Point(x, y, z));
            }
        }
        for (let i = 0; i < this.points.length; i++) {
            if (i % (this._count + 1) !== this._count) {
                this.edges.push(new Edge(i, i + 1));
            }
            if (i + this._count + 1 < this.points.length) {
                this.edges.push(new Edge(i, i + this._count + 1));
            }
        }
        for (let i = 0; i < this.points.length - this._count - 2; i++) {
            if (i % (this._count + 1) !== this._count) {
                this.polygons.push(new Polygon([i, i + 1, i + this._count + 2, i + this._count + 1], { r: 128, g: 0, b: 0 }));
            }
        }
        this.setIndexPolygons();
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
                    Количество полигонов:
                    <input
                        type="number"
                        defaultValue={this.count}
                        onChange={e => { this.count = parseInt(e.target.value, 10); }}
                    />
                </label>
            </div>
        );
    }
}
