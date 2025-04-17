import Menu from './components/menu/Menu.js';
import CalculatorComponent from './components/calculator/CalculatorComponent.js'


function Essay() {
  return <h2>essay</h2>;
}

function Graph() {
  return <h2>3д</h2>;
}

function App() {
  const menuComponents = [
    { name: 'Essay', component: <Essay /> },
    { name: 'Calculator', component: <CalculatorComponent /> },
    { name: 'Graph 3D', component: <Graph  /> },
    // { name: 'Graph 2D', components: <Graph2D /> },
  ];

  return <Menu menu={menuComponents} />;
}


export default App;
