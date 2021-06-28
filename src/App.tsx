import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import ProjectileMotion from './pages/ProjectileMotion/ProjectileMotion';
import Home from './pages/Home/Home';
import '../node_modules/katex/dist/katex.css';
import './global.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/projectile-motion-simulation">
            <ProjectileMotion />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
