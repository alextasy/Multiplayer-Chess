import './App.scss';
import { Route, Switch } from 'react-router-dom';
import HomePage from './app/pages/home-page/HomePage';
import Local from './app/pages/local/Local';
import SideMenu from './app/components/side-menu/SideMenu';
import GameContextProvider from './app/context/GameContext';

function App() {
  return (
    <GameContextProvider>
      <div className="App">
        <SideMenu />
        <div className='container'>
        <Switch>
          <Route path='/' exact component={ HomePage }/>
          <Route path='/local' exact component={ Local }/>
        </Switch>
        </div>
      </div>
    </GameContextProvider>
  );
}

export default App;
