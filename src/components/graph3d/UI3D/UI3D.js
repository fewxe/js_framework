import Cone from '../../../modules/graph3d/Math3D/figurs/cone.js';
import Cube from '../../../modules/graph3d/Math3D/figurs/Cube.js';
import Cylinder from '../../../modules/graph3d/Math3D/figurs/Cylinder.js';
import Ellipsoid from '../../../modules/graph3d/Math3D/figurs/ellipsoid.js';
import EllipticalCylinder from '../../../modules/graph3d/Math3D/figurs/ellipticalCylinder.js';
import EllipticalParaboloid from '../../../modules/graph3d/Math3D/figurs/ellipticalParaboloid.js';
import HyperbolicCylinder from '../../../modules/graph3d/Math3D/figurs/hyperboliccylinder.js';
import HyperbolicParaboloid from '../../../modules/graph3d/Math3D/figurs/hyperbolicParaboloid.js';
import OneSheetedHyperboloid from '../../../modules/graph3d/Math3D/figurs/oneSheetedHyperboloid.js';
import ParabolicCylinder from '../../../modules/graph3d/Math3D/figurs/paraboliccylinder.js';
import Sphere from '../../../modules/graph3d/Math3D/figurs/Sphere.js';
import Torus from '../../../modules/graph3d/Math3D/figurs/Torus.js';
import TwoSheetedHyperboloid from '../../../modules/graph3d/Math3D/figurs/twoSheetedHyperboloid.js';


const figuresMap = {
  cube: () => new Cube(),
  cylinder: () => new Cylinder(),
  sphere: () => new Sphere(),
  torus: () => new Torus(),
  ellipsoid: () => new Ellipsoid(),
  cone: () => new Cone(),
  paraboliccylinder: () => new ParabolicCylinder(),
  hyperboliccylinder: () => new HyperbolicCylinder(),
  ellipticalCylinder: () => new EllipticalCylinder(),
  ellipticalParaboloid: () => new EllipticalParaboloid(),
  oneSheetedHyperboloid: () => new OneSheetedHyperboloid(),
  twoSheetedHyperboloid: () => new TwoSheetedHyperboloid(),
  hyperbolicParaboloid: () => new HyperbolicParaboloid(),
};

const figureNames = [
  { value: 'cube', label: 'Cube' },
  { value: 'cylinder', label: 'Cylinder' },
  { value: 'sphere', label: 'Sphere' },
  { value: 'torus', label: 'Torus' },
  { value: 'ellipsoid', label: 'Ellipsoid' },
  { value: 'cone', label: 'Cone' },
  { value: 'paraboliccylinder', label: 'Parabolic Cylinder' },
  { value: 'hyperboliccylinder', label: 'Hyperbolic Cylinder' },
  { value: 'ellipticalCylinder', label: 'Elliptical Cylinder' },
  { value: 'ellipticalParaboloid', label: 'Elliptical Paraboloid' },
  { value: 'oneSheetedHyperboloid', label: 'One-Sheeted Hyperboloid' },
  { value: 'twoSheetedHyperboloid', label: 'Two-Sheeted Hyperboloid' },
  { value: 'hyperbolicParaboloid', label: 'Hyperbolic Paraboloid' },
];


const UI3D = ({ settings }) => {

    return (<div>
        <label>
            <input
                type="checkbox"
                defaultChecked={settings.printPolygons}
                onChange={e => { settings.printPolygons = e.target.checked }}
            />
            Полигоны
        </label>
        <label>
            <input
                type="checkbox"
                defaultChecked={settings.printPoint}
                onChange={e => { settings.printPoint = e.target.checked }}
            />
            Точки
        </label>
        <label>
            <input
                type="checkbox"
                defaultChecked={settings.printEdges}
                onChange={e => { settings.printEdges = e.target.checked }}
            />
            Ребра
        </label>
        <select
            defaultChecked={settings.figure}
            onChange={e => { settings.figure = figuresMap[e.target.value]() }}
        >
            {figureNames.map(figure => (
                <option key={figure.value} value={figure.value}>
                    {figure.label}
                </option>
            ))}
        </select>
        <div>{settings.figure.settings}</div>
    </div>);
}

export default UI3D;