import Edge from '../entities/Edge.js';
import Figure from '../entities/Figure.js';
import Point from '../entities/Point.js';
import Polygon from '../entities/Polygon.js';

class Torus extends Figure {
    constructor(origin = new Point(0, 0, 0), radialSegments = 20, tubeSegments = 10, radius = 10, tubeRadius = 3) {
        super(origin);
        this.radialSegments = radialSegments;
        this.tubeSegments = tubeSegments;
        this.radius = radius;
        this.tubeRadius = tubeRadius;
        this.localPoints = [];
        this.edges = [];
        this.polygons = [];
        this.updateGeometry();
    }

    updateGeometry() {
        this.localPoints = [];
        this.edges = [];
        this.polygons = [];
        const radialStep = (2 * Math.PI) / this.radialSegments;
        const tubeStep = (2 * Math.PI) / this.tubeSegments;

        for (let r = 0; r < this.radialSegments; r++) {
            const radialAngle = r * radialStep;
            const cosRadial = Math.cos(radialAngle);
            const sinRadial = Math.sin(radialAngle);
            for (let t = 0; t < this.tubeSegments; t++) {
                const tubeAngle = t * tubeStep;
                const cosTube = Math.cos(tubeAngle);
                const sinTube = Math.sin(tubeAngle);
                this.localPoints.push(new Point(
                    (this.radius + this.tubeRadius * cosTube) * cosRadial,
                    (this.radius + this.tubeRadius * cosTube) * sinRadial,
                    this.tubeRadius * sinTube
                ));
            }
        }
        for (let r = 0; r < this.radialSegments; r++) {
            const ringStart = r * this.tubeSegments;
            for (let t = 0; t < this.tubeSegments; t++) {
                this.edges.push(new Edge(
                    ringStart + t,
                    ringStart + (t + 1) % this.tubeSegments
                ));
            }
        }
        for (let t = 0; t < this.tubeSegments; t++) {
            for (let r = 0; r < this.radialSegments; r++) {
                this.edges.push(new Edge(
                    r * this.tubeSegments + t,
                    ((r + 1) % this.radialSegments) * this.tubeSegments + t
                ));
            }
        }
        for (let r = 0; r < this.radialSegments; r++) {
            for (let t = 0; t < this.tubeSegments; t++) {
                const a = r * this.tubeSegments + t;
                const b = r * this.tubeSegments + (t + 1) % this.tubeSegments;
                const c = ((r + 1) % this.radialSegments) * this.tubeSegments + (t + 1) % this.tubeSegments;
                const d = ((r + 1) % this.radialSegments) * this.tubeSegments + t;
                this.polygons.push(new Polygon([a, b, c, d]));
            }
        }
    }

    settings() {
        return (
            <div>
                <label>
                    Радиус:
                    <input
                        type="number"
                        defaultValue={this.radius}
                        onChange={e => { this.radius = parseFloat(e.target.value); this.updateGeometry(); }}
                    />
                </label>
                <label>
                    Количество полигонов:
                    <input
                        type="number"
                        defaultValue={this.radialSegments}
                        onChange={e => { this.radialSegments = parseInt(e.target.value, 10); this.updateGeometry(); }}
                    />
                </label>
            </div>
        );
    }
}

export default Torus;
