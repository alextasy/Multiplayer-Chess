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
  const { isChangingName, setUserDisplayName } = useContext(AppContext);
  const overlay = useRef(null);

  // Set an initial display name for user
  useEffect(() => {
    const id = Math.floor(Math.random() * 10000);
    setUserDisplayName(`Guest_${id}`);
  }, []);

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
          <div className={`authOverlay ${isChangingName ? 'active' : ''}`} ref={ overlay }></div>
        </div>
      </div>
    </GameContextProvider>
  );
}

export default App;
