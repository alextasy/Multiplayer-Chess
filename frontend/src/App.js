import './App.scss';
import { Route, Switch } from 'react-router-dom';
import Home from './app/pages/home/Home';
import Local from './app/pages/local/Local';
import SideMenu from './app/components/side-menu/SideMenu';
import GameContextProvider from './app/context/GameContext';
import Multiplayer from './app/pages/multiplayer/Multiplayer';
import SignUp from './app/pages/sign-up/SignUp';

function App() {
  return (
    <GameContextProvider>
      <div className="App">
        <SideMenu />
        <div className='container'>
        <Switch>
          <Route path='/' exact component={ Home }/>
          <Route path='/local' exact component={ Local }/>
          <Route path='/multiplayer' exact component={ Multiplayer }/>
          <Route path='/signup' exact component={ SignUp }/>
        </Switch>
        </div>
      </div>
    </GameContextProvider>
  );
}

export default App;
