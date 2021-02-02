import React from 'react';
import './HomePage.scss';
import SideMenu from '../../components/side-menu/SideMenu';
import Board from '../../components/board/Board';

function HomePage() {
    return (
        <div className='HomePage'>
            <SideMenu />
            <Board />
        </div>
    )
}

export default HomePage;
