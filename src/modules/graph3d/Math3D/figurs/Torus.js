import Edge from '../entities/Edge.js';
import Figure from '../entities/Figure.js';
import Point from '../entities/Point.js';
import Polygon from '../entities/Polygon.js';

class Torus extends Figure {
    constructor(origin = new Point(0, 0, 0), count = 20, radius = 10, tubeRadius = 3) {
        super(origin);
        this.count = count;
        this.radius = radius;
        this.tubeRadius = tubeRadius;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        this.updateGeometry();
    }

    updateGeometry() {
        const radialSegments = this.count;
        const tubeSegments = this.count;
        const radius = this.radius;
        const tubeRadius = this.tubeRadius;
        this.points = [];
        this.edges = [];
        this.polygons = [];
        const radialStep = (2 * Math.PI) / radialSegments;
        const tubeStep = (2 * Math.PI) / tubeSegments;

        for (let r = 0; r < radialSegments; r++) {
            const radialAngle = r * radialStep;
            const cosRadial = Math.cos(radialAngle);
            const sinRadial = Math.sin(radialAngle);
            for (let t = 0; t < tubeSegments; t++) {
                const tubeAngle = t * tubeStep;
                const cosTube = Math.cos(tubeAngle);
                const sinTube = Math.sin(tubeAngle);
                this.points.push(new Point(
                    (radius + tubeRadius * cosTube) * cosRadial,
                    (radius + tubeRadius * cosTube) * sinRadial,
                    tubeRadius * sinTube
                ));
            }
        }
        for (let r = 0; r < radialSegments; r++) {
            const ringStart = r * tubeSegments;
            for (let t = 0; t < tubeSegments; t++) {
                this.edges.push(new Edge(
                    ringStart + t,
                    ringStart + (t + 1) % tubeSegments
                ));
            }
        }
        for (let t = 0; t < tubeSegments; t++) {
            for (let r = 0; r < radialSegments; r++) {
                this.edges.push(new Edge(
                    r * tubeSegments + t,
                    ((r + 1) % radialSegments) * tubeSegments + t
                ));
            }
        }
        for (let r = 0; r < radialSegments; r++) {
            for (let t = 0; t < tubeSegments; t++) {
                const a = r * tubeSegments + t;
                const b = r * tubeSegments + (t + 1) % tubeSegments;
                const c = ((r + 1) % radialSegments) * tubeSegments + (t + 1) % tubeSegments;
                const d = ((r + 1) % radialSegments) * tubeSegments + t;
                this.polygons.push(new Polygon([a, b, c, d]));
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
                    Радиус тора:
                    <input
                        type="number"
                        defaultValue={this.radius}
                        min={1}
                        onChange={e => { this.radius = parseFloat(e.target.value) || 1; this.updateGeometry(); }}
                    />
                </label>
                <label>
                    Радиус трубы:
                    <input
                        type="number"
                        defaultValue={this.tubeRadius}
                        min={1}
                        onChange={e => { this.tubeRadius = parseFloat(e.target.value) || 1; this.updateGeometry(); }}
                    />
                </label>
            </div>
        );
    }
}

export default Torus;
