import Edge from '../entities/Edge.js';
import Figure from '../entities/Figure.js';
import Point from '../entities/Point.js';
import Polygon from '../entities/Polygon.js';

export default class HyperbolicCylinder extends Figure {
    constructor(origin = new Point(0, 0, 0), count = 10) {
        super(origin);
        this.count = count;
        this.localPoints = [];
        this.edges = [];
        this.polygons = [];
        this.updateGeometry();
    }

    updateGeometry() {
        this.localPoints = [];
        this.edges = [];
        this.polygons = [];
        let size = 5;
        for (let i = -this.count; i < this.count; i++) {
            for (let j = 0; j < this.count; j++) {
                const x = i + size / this.count;
                const y = x * x / size;
                const z = j - size;
                this.localPoints.push(new Point(x, y, z));
            }
        }
        size = -5;
        for (let i = -this.count; i < this.count; i++) {
            for (let j = 0; j < this.count; j++) {
                const x = i - size / this.count;
                const y = x * x / size;
                const z = j + size;
                this.localPoints.push(new Point(x, y, z));
            }
        }
        for (let i = 0; i < this.localPoints.length / 2 - this.count; i++) {
            if (i + 1 < this.localPoints.length && (i + 1) % this.count !== 0) {
                this.edges.push(new Edge(i, i + 1));
            } else if ((i + 1) % this.count === 0) {
                this.edges.push(new Edge(i, i + 1 - this.count));
            }
            if (i < this.localPoints.length - this.count) {
                this.edges.push(new Edge(i, i + this.count));
            }
        }
        for (let i = this.localPoints.length / 2; i < this.localPoints.length; i++) {
            if (i + 1 < this.localPoints.length && (i + 1) % this.count !== 0) {
                this.edges.push(new Edge(i, i + 1));
            } else if ((i + 1) % this.count === 0) {
                this.edges.push(new Edge(i, i + 1 - this.count));
            }
            if (i < this.localPoints.length - this.count) {
                this.edges.push(new Edge(i, i + this.count));
            }
        }
        for (let i = 0; i < this.localPoints.length / 2 - this.count; i++) {
            if (i + 1 + this.count < this.localPoints.length && (i + 1) % this.count !== 0) {
                this.polygons.push(new Polygon([i, i + 1, i + 1 + this.count, i + this.count]));
            } else if (i + this.count < this.localPoints.length && (i + 1) % this.count === 0) {
                this.polygons.push(new Polygon([i, i + 1 - this.count, i + 1, i + this.count]));
            }
        }
        for (let i = this.localPoints.length / 2 + this.count / 2; i < this.localPoints.length; i++) {
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