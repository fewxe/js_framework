import Edge from '../entities/Edge.js';
import Figure from '../entities/Figure.js';
import Point from '../entities/Point.js';
import Polygon from '../entities/Polygon.js';

export default class HyperbolicParaboloid extends Figure {
    constructor(origin = new Point(0, 0, 0), count = 20, a = 3, b = 2) {
        super(origin);
        this.count = count;
        this.a = a;
        this.b = b;
        this.localPoints = [];
        this.edges = [];
        this.polygons = [];
        this.updateGeometry();
    }

    updateGeometry() {
        this.localPoints = [];
        this.edges = [];
        this.polygons = [];
        for (let x = -10; x < 10; x++) {
            for (let y = -10; y < 10; y++) {
                this.localPoints.push(new Point(
                    x,
                    y,
                    x * x / (this.a * this.a) - y * y / (this.b * this.b)
                ));
            }
        }
        for (let i = 0; i < this.localPoints.length; i++) {
            if (i + 1 < this.localPoints.length && (i + 1) % this.count !== 0) {
                this.edges.push(new Edge(i, i + 1));
            }
            if (i < this.localPoints.length - this.count) {
                this.edges.push(new Edge(i, i + this.count));
            }
        }
        for (let i = 0; i < this.localPoints.length; i++) {
            if (i % 2 === 0) {
                if (i + 1 + this.count < this.localPoints.length && (i + 1) % this.count !== 0) {
                    this.polygons.push(new Polygon([i, i + 1, i + 1 + this.count, i + this.count]));
                }
            } else if (i + 1 + this.count < this.localPoints.length && (i + 1) % this.count !== 0) {
                this.polygons.push(new Polygon([i, i + 1, i + 1 + this.count, i + this.count]));
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