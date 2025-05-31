import Edge from '../entities/Edge.js';
import Figure from '../entities/Figure.js';
import Point from '../entities/Point.js';
import Polygon from '../entities/Polygon.js';

export default class OneSheetedHyperboloid extends Figure {
    constructor(origin = new Point(0, 0, 0), count = 20, a = 1, b = 1, c = 1) {
        super(origin);
        this.count = count;
        this.a = a;
        this.b = b;
        this.c = c;
        this.localPoints = [];
        this.edges = [];
        this.polygons = [];
        this.updateGeometry();
    }

    updateGeometry() {
        this.localPoints = [];
        this.edges = [];
        this.polygons = [];
        const dt = Math.PI * 2 / this.count;
        for (let i = -Math.PI; i <= Math.PI; i += dt) {
            for (let j = 0; j < 2 * Math.PI; j += dt) {
                this.localPoints.push(new Point(
                    this.a * Math.cosh(i) * Math.cos(j),
                    this.c * Math.sinh(i),
                    this.b * Math.cosh(i) * Math.sin(j)
                ));
            }
        }
        for (let i = 0; i < this.localPoints.length; i++) {
            if (i + 1 < this.localPoints.length && (i + 1) % this.count !== 0) {
                this.edges.push(new Edge(i, i + 1));
            } else if ((i + 1) % this.count === 0) {
                this.edges.push(new Edge(i, i + 1 - this.count));
            }
            if (i < this.localPoints.length - this.count) {
                this.edges.push(new Edge(i, i + this.count));
            }
        }
        for (let i = 0; i < this.localPoints.length; i++) {
            if (i + 1 + this.count < this.localPoints.length && (i + 1) % this.count !== 0) {
                this.polygons.push(new Polygon([i, i + 1, i + 1 + this.count, i + this.count]));
            } else if (i + this.count < this.localPoints.length && (i + 1) % this.count === 0) {
                this.polygons.push(new Polygon([i, i + 1 - this.count, i + 1, i + this.count]));
            }
        }
    }

    settings() {
        return (
            <div>
                <label>
                    a:
                    <input
                        type="number"
                        defaultValue={this.a}
                        onChange={e => { this.a = parseFloat(e.target.value) || 1; this.updateGeometry(); }}
                    />
                </label>
                <label>
                    b:
                    <input
                        type="number"
                        defaultValue={this.b}
                        onChange={e => { this.b = parseFloat(e.target.value) || 1; this.updateGeometry(); }}
                    />
                </label>
                <label>
                    c:
                    <input
                        type="number"
                        defaultValue={this.c}
                        onChange={e => { this.c = parseFloat(e.target.value) || 1; this.updateGeometry(); }}
                    />
                </label>
                <label>
                    count:
                    <input
                        type="number"
                        defaultValue={this.count}
                        min={3}
                        onChange={e => { this.count = parseInt(e.target.value, 10) || 3; this.updateGeometry(); }}
                    />
                </label>
            </div>
        );
    }
}