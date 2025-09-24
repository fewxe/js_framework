import Edge from '../entities/Edge.js';
import Figure from '../entities/Figure.js';
import Point from '../entities/Point.js';
import Polygon from '../entities/Polygon.js';

export default class HyperbolicCylinder extends Figure {
    constructor(origin = new Point(0, 0, 0), count = 25) {
        super(origin);
        this.count = count;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        this.updateGeometry();
    }

    updateGeometry() {
        const size = 5;
        const count = this.count;
        this.points = [];
        this.edges = [];
        this.polygons = [];

        for (let i = -count; i < count; i++) {
            for (let j = 0; j < count; j++) {
                const x = i;
                const y = (x * x) / size;
                const z = j - size;
                this.points.push(new Point(x, y, z));
            }
        }

        for (let i = -count; i < count; i++) {
            for (let j = 0; j < count; j++) {
                const x = i;
                const y = -(x * x) / size;
                const z = j - size;
                this.points.push(new Point(x, y, z));
            }
        }

        const half = this.points.length / 2;

        for (let i = 0; i < half - count; i++) {
            const isRightEdge = (i + 1) % count === 0;
            if (!isRightEdge) {
                this.edges.push(new Edge(i, i + 1));
                this.polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count]));
            }
            this.edges.push(new Edge(i, i + count));
        }

        for (let i = half; i < this.points.length - count; i++) {
            const isRightEdge = (i + 1) % count === 0;
            if (!isRightEdge) {
                this.edges.push(new Edge(i, i + 1));
                this.polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count]));
            }
            this.edges.push(new Edge(i, i + count));
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
                        onChange={e => {
                            this.count = parseInt(e.target.value, 10) || 3;
                            this.updateGeometry();
                        }}
                    />
                </label>
            </div>
        );
    }
}
