import Menu from './components/menu/Menu.js';
import CalculatorComponent from './components/calculator/CalculatorComponent.js'
import Graph3D from './components/graph3d/Graph3D.js';


function Essay() {
  return <h2>essay</h2>;
}

function Graph2D() {
  return <h2>сегодня без графиков</h2>;
}

function App() {
  const menuComponents = [
    { name: 'Essay', component: <Essay /> },
    { name: 'Calculator', component: <CalculatorComponent /> },
    { name: 'Graph 3D', component: <Graph3D  /> },
    { name: 'Graph 2D', components: <Graph2D /> },
  ];

  return <Menu menu={menuComponents} />;
}


export default App;
