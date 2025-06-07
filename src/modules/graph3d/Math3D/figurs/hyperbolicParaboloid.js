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
        this.points = [];
        this.edges = [];
        this.polygons = [];
        this.updateGeometry();
    }

    updateGeometry() {
        const a = this.a, b = this.b;
        const count = this.count;
        const size = 10;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        
        const step = (2 * size) / (count - 1);
        for (let i = 0; i < count; i++) {
            const x = -size + i * step;
            for (let j = 0; j < count; j++) {
                const y = -size + j * step;
                this.points.push(new Point(
                    x,
                    y,
                    x * x / (a * a) - y * y / (b * b)
                ));
            }
        }
        // Рёбра
        for (let i = 0; i < this.points.length; i++) {
            if ((i + 1) % count !== 0) {
                this.edges.push(new Edge(i, i + 1));
            }
            if (i + count < this.points.length) {
                this.edges.push(new Edge(i, i + count));
            }
        }
        // Полигоны
        for (let i = 0; i < this.points.length - count; i++) {
            if ((i + 1) % count !== 0) {
                this.polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count]));
            }
        }
        this.setIndexPolygons();
    }

    settings() {
        return (
            <div>
                <label>
                    Количество полигонов:
                    <input
                        type="number"
                        defaultValue={this.count}
                        min={3}
                        onChange={e => { this.count = parseInt(e.target.value, 10) || 3; this.updateGeometry(); }}
                    />
                </label>
                <label>
                    a:
                    <input
                        type="number"
                        defaultValue={this.a}
                        min={1}
                        onChange={e => { this.a = parseFloat(e.target.value) || 1; this.updateGeometry(); }}
                    />
                </label>
                <label>
                    b:
                    <input
                        type="number"
                        defaultValue={this.b}
                        min={1}
                        onChange={e => { this.b = parseFloat(e.target.value) || 1; this.updateGeometry(); }}
                    />
                </label>
            </div>
        );
    }
}