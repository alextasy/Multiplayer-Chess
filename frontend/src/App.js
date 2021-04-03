import './App.scss';
import { Route, Switch } from 'react-router-dom';
import Home from './app/pages/home/Home';
import Local from './app/pages/local/Local';
import SideMenu from './app/components/side-menu/SideMenu';
import Multiplayer from './app/pages/multiplayer/Multiplayer';
import GameContextProvider from './app/context/GameContext';
import AppContextProvider from './app/context/AppContext';

function App() {
  return (
    <GameContextProvider>
    <AppContextProvider>
      <div className="App">
        <SideMenu />
        <div className='container'>
        <Switch>
          <Route path='/' exact component={ Home }/>
          <Route path='/local' exact component={ Local }/>
          <Route path='/multiplayer' exact component={ Multiplayer }/>
        </Switch>
        </div>
      </div>
    </AppContextProvider>
    </GameContextProvider>
  );
}

export default App;
