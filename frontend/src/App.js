import './App.scss';
import { Route, Switch } from 'react-router-dom';
import HomePage from './app/pages/home-page/HomePage';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path='/' exact component={HomePage}/>
      </Switch>
    </div>
  );
}

export default App;
