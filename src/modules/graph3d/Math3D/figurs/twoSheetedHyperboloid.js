import Edge from '../entities/Edge.js';
import Figure from '../entities/Figure.js';
import Point from '../entities/Point.js';
import Polygon from '../entities/Polygon.js';

export default class TwoSheetedHyperboloid extends Figure {
    constructor(origin = new Point(0, 0, 0), count = 20, a = 1, b = 1, c = 1) {
        super(origin);
        this.count = count;
        this.a = a;
        this.b = b;
        this.c = c;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        this.updateGeometry();
    }

    updateGeometry() {
        this.points = [];
        this.edges = [];
        this.polygons = [];
        const dt = Math.PI * 2 / this.count;
        for (let i = 0; i <= Math.PI; i += dt) {
            for (let j = 0; j < 2 * Math.PI; j += dt) {
                this.points.push(new Point(
                    this.a * Math.sinh(i) * Math.cos(j),
                    this.c * Math.cosh(i),
                    this.b * Math.cosh(i) * Math.sin(j)
                ));
            }
        }
        for (let i = 0; i <= Math.PI; i += dt) {
            for (let j = 0; j < 2 * Math.PI; j += dt) {
                this.points.push(new Point(
                    -this.a * Math.sinh(i) * Math.cos(j),
                    -this.c * Math.cosh(i),
                    -this.b * Math.cosh(i) * Math.sin(j)
                ));
            }
        }
        for (let i = 0; i < this.points.length / 2; i++) {
            if (i + 1 < this.points.length && (i + 1) % this.count !== 0) {
                this.edges.push(new Edge(i, i + 1));
            } else if ((i + 1) % this.count === 0) {
                this.edges.push(new Edge(i, i + 1 - this.count));
            }
            if (i < this.points.length / 2 - this.count) {
                this.edges.push(new Edge(i, i + this.count));
            }
        }
        for (let i = this.points.length / 2 + this.count; i < this.points.length; i++) {
            if (i + 1 < this.points.length && (i + 1) % this.count !== 0) {
                this.edges.push(new Edge(i, i + 1));
            } else if ((i + 1) % this.count === 0) {
                this.edges.push(new Edge(i, i + 1 - this.count));
            }
            if (i < this.points.length - this.count) {
                this.edges.push(new Edge(i, i + this.count));
            }
        }
        for (let i = 0; i < this.points.length / 2 - this.count; i++) {
            if (i + 1 + this.count < this.points.length && (i + 1) % this.count !== 0) {
                this.polygons.push(new Polygon([i, i + 1, i + 1 + this.count, i + this.count]));
            } else if (i + this.count < this.points.length && (i + 1) % this.count === 0) {
                this.polygons.push(new Polygon([i, i + 1 - this.count, i + 1, i + this.count]));
            }
        }
        for (let i = this.points.length / 2; i < this.points.length; i++) {
            if (i + 1 + this.count < this.points.length && (i + 1) % this.count !== 0) {
                this.polygons.push(new Polygon([i, i + 1, i + 1 + this.count, i + this.count]));
            } else if (i + this.count < this.points.length && (i + 1) % this.count === 0) {
                this.polygons.push(new Polygon([i, i + 1 - this.count, i + 1, i + this.count]));
            }
        }
        this.setIndexPolygons();
    }

    settings() {
        return (
            <div>
                <label>
                    a:
                    <input
                        type="number"
                        defaultValue={this.a}
                        onChange={e => { this.a = parseFloat(e.target.value); this.updateGeometry(); }}
                    />
                </label>
                <label>
                    b:
                    <input
                        type="number"
                        defaultValue={this.b}
                        onChange={e => { this.b = parseFloat(e.target.value); this.updateGeometry(); }}
                    />
                </label>
                <label>
                    c:
                    <input
                        type="number"
                        defaultValue={this.c}
                        onChange={e => { this.c = parseFloat(e.target.value); this.updateGeometry(); }}
                    />
                </label>
                <label>
                    count:
                    <input
                        type="number"
                        defaultValue={this.count}
                        min={3}
                        onChange={e => { this.count = parseInt(e.target.value, 10); this.updateGeometry(); }}
                    />
                </label>
            </div>
        );
    }
}