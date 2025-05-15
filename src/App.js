import CalculatorComponent from './components/calculator/CalculatorComponent.js';
import Essay from './components/essay/EssayComponent.js';
import Graph2D from './components/graph2d/Graph2D.js';
import Graph3D from './components/graph3d/Graph3D.js';
import Menu from './components/menu/Menu.js';

function App() {
  const menuComponents = [
    { name: 'Essay', component: <Essay /> },
    { name: 'Calculator', component: <CalculatorComponent /> },
    { name: 'Graph 3D', component: <Graph3D  /> },
    { name: 'Graph 2D', component: <Graph2D /> },
  ];

  return <Menu menu={menuComponents} />;
}

export default App;
