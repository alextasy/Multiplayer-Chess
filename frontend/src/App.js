import './App.scss';
import { Route, Routes } from 'react-router-dom';
import Home from './app/pages/home/Home';
import Local from './app/pages/local/Local';
import SideMenu from './app/components/side-menu/SideMenu';
import Multiplayer from './app/pages/multiplayer/Multiplayer';
import GameContextProvider from './app/context/GameContext';
import { AppContext } from './app/context/AppContext';
import { useContext, useEffect, useRef } from 'react';

function App() {
  const { isSigningIn, isSigningUp, isAuth, setIsAuth, setUser } = useContext(AppContext);
  const overlay = useRef(null);

  function handleNoToken() {
    localStorage.clear();
    const id = Math.floor(Math.random() * 10000);
    setUser({ displayName: `Guest_${id}` });
  }

  // Sign in from cache if the token hasn't expired
  useEffect(() => {
    const authInfoJSON = localStorage.getItem('authInfo');
    if (!authInfoJSON) return handleNoToken();
    const authInfo = JSON.parse(authInfoJSON);
    // Issued at and expiresIn are stored in seconds, so we compare the sum of those to the current time in seconds
    if (authInfo.iat + authInfo.expiresIn < new Date().getTime() / 1000) return handleNoToken();

    setUser(authInfo);
    setIsAuth(true);
  }, [isAuth]);

  return (
    <GameContextProvider>
      <div className="App">
        <SideMenu />
        <div className='container'>
          <Routes>
            <Route path='/' exact element={ <Home /> }/>
            <Route path='/local' exact element={ <Local /> }/>
            <Route path='/multiplayer' exact element={ <Multiplayer /> }/>
          </Routes>
          <div className={`authOverlay ${isSigningIn || isSigningUp ? 'active' : ''}`} ref={ overlay }></div>
        </div>
      </div>
    </GameContextProvider>
  );
}

export default App;
