import { useState } from 'react';
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

const UI3D = ({ settings, WIN }) => {
    const [selectedFigure, setSelectedFigure] = useState('cube');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [, forceUpdate] = useState({});

    const handleAddFigure = () => {
        const newFigure = figuresMap[selectedFigure]();
        settings.figures.push(newFigure);
        setSelectedIndex(settings.figures.length - 1);
        forceUpdate({});
    };

    const handleRemoveFigure = () => {
        if (settings.figures.length > 0) {
            settings.figures.splice(selectedIndex, 1);
            setSelectedIndex(Math.max(0, selectedIndex - 1));
            forceUpdate({});
        }
    };

    const handleSelectFigure = (e) => {
        setSelectedIndex(Number(e.target.value));
    };

    const handleOriginChange = (axis, value) => {
        const fig = settings.figures[selectedIndex];
        if (fig) {
            fig.origin[axis] = parseFloat(value);
            forceUpdate({});
        }
    };

    const selectedFig = settings.figures[selectedIndex];

    return (
        <div>
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
            <div>
                <select
                    value={selectedFigure}
                    onChange={e => setSelectedFigure(e.target.value)}
                >
                    {figureNames.map(figure => (
                        <option key={figure.value} value={figure.value}>
                            {figure.label}
                        </option>
                    ))}
                </select>
                <button onClick={handleAddFigure}>Добавить фигуру</button>
            </div>
            <div>
                <label>Выбрать фигуру:
                    <select value={selectedIndex} onChange={handleSelectFigure}>
                        {settings.figures.map((fig, idx) => (
                            <option key={idx} value={idx}>
                                {fig.constructor.name} #{idx + 1}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleRemoveFigure} disabled={settings.figures.length === 0}>Удалить</button>
                </label>
            </div>
            {selectedFig && (
                <div>
                    <label>
                        X:
                        <input
                            type="number"
                            value={selectedFig.origin.x}
                            onChange={e => handleOriginChange('x', e.target.value)}
                        />
                    </label>
                    <label>
                        Y:
                        <input
                            type="number"
                            value={selectedFig.origin.y}
                            onChange={e => handleOriginChange('y', e.target.value)}
                        />
                    </label>
                    <label>
                        Z:
                        <input
                            type="number"
                            value={selectedFig.origin.z}
                            onChange={e => handleOriginChange('z', e.target.value)}
                        />
                    </label>
                </div>
            )}
            <label>
                <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1"
                    defaultValue={WIN.LIGHT.lumen}
                    onChange={e => { WIN.LIGHT.lumen = e.target.value }}
                />
                Свет
            </label>
            <div>
                {selectedFig && selectedFig.settings
                    ? selectedFig.settings()
                    : null}
            </div>
        </div>
    );
};

export default UI3D;