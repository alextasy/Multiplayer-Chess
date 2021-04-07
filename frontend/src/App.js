import './App.scss';
import { Route, Switch } from 'react-router-dom';
import Home from './app/pages/home/Home';
import Local from './app/pages/local/Local';
import SideMenu from './app/components/side-menu/SideMenu';
import Multiplayer from './app/pages/multiplayer/Multiplayer';
import GameContextProvider from './app/context/GameContext';
import { AppContext } from './app/context/AppContext';
import { useContext, useEffect, useRef } from 'react';

function App() {
  const { isSigningIn, isSigningUp, setIsAuth, setUser } = useContext(AppContext);
  const overlay = useRef(null);
  const initialLoad = useRef(true);

  // Sign in from cache if the token hasn't expired
  useEffect(() => {
    const authInfoJSON = localStorage.getItem('authInfo');
    if (!authInfoJSON) return;
    const authInfo = JSON.parse(authInfoJSON);
    // Issued at and expiresIn are stored in seconds, so we compare the sum of those to the current time in seconds
    if (authInfo.iat + authInfo.expiresIn < new Date().getTime() / 1000) return localStorage.clear();

    setUser(authInfo);
    setIsAuth(true);
  }, []);

  useEffect(() => {
    if (initialLoad.current) return initialLoad.current = false;
    overlay.current.classList.toggle('active');
  }, [isSigningIn, isSigningUp])

  return (
    <GameContextProvider>
      <div className="App">
        <SideMenu />
        <div className='container'>
          <Switch>
            <Route path='/' exact component={ Home }/>
            <Route path='/local' exact component={ Local }/>
            <Route path='/multiplayer' exact component={ Multiplayer }/>
          </Switch>
          <div className='authOverlay' ref={ overlay }></div>
        </div>
      </div>
    </GameContextProvider>
  );
}

export default App;
