import React from 'react';
import './HomePage.scss';
import Board from '../../components/board/Board';
import Button from '../../components/button/Button';
import { withRouter } from 'react-router-dom';
import HorizontalLine from '../../components/horizontal-line/HorizontalLine';

function HomePage({ history }) {
    return (
        <div className='HomePage'>
            <div className='hero-section'>
                <h1>FREE ONLINE CHESS</h1>
                <h2>PLAY EASILY WITH ANYONE YOU CHOOSE</h2>
                <p>Invite your friends and play some chess online! Feel free to
                    <b onClick={()=> history.push('/sign-up')}> SIGN UP</b> to get cool new features such as having a custom display name, tracking your match history and personal statistics! </p>
                <p>Playing as a guest is also an option - no strings attached. You can hop on and play a quick game anonymously anytime you wish!</p>
                <div>
                    <Button click={()=> history.push('/sign-in')} color='primary'>SIGN IN</Button>
                    <Button click={()=> history.push('/sign-in')} color='highlight'>PLAY AS A GUEST</Button>
                </div>
            </div>
            <Board playable={ false }/>
            <HorizontalLine width='70%'/>
        </div>
    )
}

export default withRouter(HomePage);
