import React, { useContext } from 'react';
import './Home.scss';
import Board from '../../components/board/Board';
import Button from '../../components/button/Button';
import { withRouter } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import HorizontalLine from '../../components/horizontal-line/HorizontalLine';

function Home({ history }) {
    const appContext = useContext(AppContext);
    return (
        <div className='HomePage'>
            <div className='hero-section'>
                <h1>FREE ONLINE CHESS</h1>
                <h2>PLAY EASILY WITH ANYONE YOU CHOOSE</h2>
                <p>Invite your friends and play some chess online! Feel free to
                    <b onClick={() => appContext.setIsSigningUp(true) }> SIGN UP</b> to get cool new features such as having a custom display name, tracking your match history and personal statistics! </p>
                <p>Playing as a guest is also an option - no strings attached. You can hop on and play a quick game anonymously anytime you wish!</p>
                <div>
                    <Button click={() => appContext.setIsSigningIn(true) } color='primary'>SIGN IN</Button>
                    <Button click={()=> history.push('/multiplayer') } color='highlight'>PLAY AS A GUEST</Button>
                </div>
            </div>
            <Board playable={ false }/>
            <HorizontalLine />
        </div>
    )
}

export default withRouter(Home);
