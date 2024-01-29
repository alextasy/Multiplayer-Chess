import React, { useContext } from 'react';
import './Home.scss';
import Board from '../../components/board/Board';
import Button from '../../components/button/Button';
import { AppContext } from '../../context/AppContext';
import HorizontalLine from '../../components/horizontal-line/HorizontalLine';

function Home() {
    const { setIsChangingName } = useContext(AppContext);

    return (
        <div className='HomePage'>
            <div className='hero-section'>
                <h1>FREE ONLINE CHESS</h1>
                <h2>PLAY EASILY WITH ANYONE YOU CHOOSE</h2>
                <p>Invite your friends and play some chess online! Feel free to visit the <b>ONLINE MULTIPLAYER</b> tab where you can create or join game rooms! In-game you will have access to a direct chat with your opponent!</p>
                <p>You can also visit our <b>LOCAL PLAY</b> tab where you can play alone or with a friend next to you, using both teams! And remember to <b>HAVE FUN</b> along the way!</p>
                <div className='buttons'>
                    <Button linkTo={ '/multiplayer' } color='primary'>ONLINE MULTIPLAYER</Button>
                    <Button linkTo={ '/local' } color='highlight'>LOCAL PLAY</Button>
                </div>
            </div>
            <Board playable={ false }/>
        </div>
    )
}

export default Home;
