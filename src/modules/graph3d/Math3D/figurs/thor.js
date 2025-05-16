import Edge from '../entities/Edge.js';
import Point from '../entities/Point.js';
import Polygon from '../entities/Polygon.js';

export default class Thor {
    constructor(count = 20, R = 10, r = 5) {
        this.count = count;
        this.R = R;
        this.r = r;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        this.updateGeometry();
    }

    updateGeometry() {
        this.points = [];
        this.edges = [];
        this.polygons = [];
        const da = Math.PI * 2 / this.count;
        for (let phi = 0; phi < Math.PI * 2; phi += da) {
            for (let psi = -Math.PI; psi < Math.PI; psi += da) {
                const x = (this.R + this.r * Math.cos(psi)) * Math.cos(phi);
                const y = (this.R + this.r * Math.cos(psi)) * Math.sin(phi);
                const z = this.r * Math.sin(psi);
                this.points.push(new Point(x, y, z));
            }
        }
        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i + 1]) {
                if ((i + 1) % this.count === 0) {
                    this.edges.push(new Edge(i, i + 1 - this.count));
                } else {
                    this.edges.push(new Edge(i, i + 1));
                }
            }
            if (this.points[i + this.count]) {
                this.edges.push(new Edge(i, i + this.count));
            } else {
                this.edges.push(new Edge(i, i % this.count));
            }
        }
        for (let i = 0; i < this.points.length; i++) {
            if (this.points[i + this.count + 1]) {
                this.polygons.push(new Polygon([
                    i,
                    i + 1,
                    i + this.count + 1,
                    i + this.count
                ], '#ffff00'));
            } else {
                if (this.points[i + 1]) {
                    this.polygons.push(new Polygon([
                        i,
                        i + 1,
                        i - (this.points.length - 2 - this.count),
                        i - (this.points.length - 1 - this.count)
                    ], '#ffff00'));
                }
            }
        }
    }

    settings() {
        return (
            <div>
                <label>
                    R:
                    <input
                        type="number"
                        defaultValue={this.R}
                        onChange={e => { this.R = parseFloat(e.target.value) || 1; this.updateGeometry(); }}
                    />
                </label>
                <label>
                    r:
                    <input
                        type="number"
                        defaultValue={this.r}
                        onChange={e => { this.r = parseFloat(e.target.value) || 1; this.updateGeometry(); }}
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