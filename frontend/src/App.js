import './App.scss';
import { Route, Routes } from 'react-router-dom';
import Home from './app/pages/home/Home';
import Local from './app/pages/local/Local';
import SideMenu from './app/components/side-menu/SideMenu';
import Multiplayer from './app/pages/multiplayer/Multiplayer';
import GameContextProvider from './app/context/GameContext';
import { AppContext } from './app/context/AppContext';
import { useContext, useEffect, useState } from 'react';
import menuIcon from './assets/icons/menu.svg';
import logo from './assets/icons/logo.png';
import { Link } from 'react-router-dom';

function App() {
  const { isChangingName, setIsChangingName, setUserDisplayName } = useContext(AppContext);
  const [isSideMenuExpanded, setIsSideMenuExpanded] = useState(true);
  const menuCloseTransition = 350;

  // Set an initial display name for user
  useEffect(() => {
    const id = Math.floor(Math.random() * 10000);
    setUserDisplayName(`Guest_${id}`);
  }, []);

  function closeSideMenu() {
    setIsSideMenuExpanded(false);
    setTimeout(() => setIsChangingName(false), menuCloseTransition);
  }

  return (
    <GameContextProvider>
      <div className="App">
        <header>
          <img onClick={ ()=> setIsSideMenuExpanded(!isSideMenuExpanded) } className='menu-icon' src={ menuIcon } alt='menu icon'/>
          <Link className='logo' to='/'><img src={ logo } alt='logo'/></Link>
        </header>
        <div className='container'>
          <SideMenu isSideMenuExpanded={isSideMenuExpanded} close={ closeSideMenu }/>
          <Routes>
            <Route path='/' exact element={ <Home /> }/>
            <Route path='/local' exact element={ <Local /> }/>
            <Route path='/multiplayer' exact element={ <Multiplayer /> }/>
          </Routes>
        </div>
        <div onClick={ closeSideMenu } className={`side-menu-overlay ${isChangingName ? 'active' : ''} ${isSideMenuExpanded ? 'side-menu-active' : ''}`}></div>
      </div>
    </GameContextProvider>
  );
}

export default App;
