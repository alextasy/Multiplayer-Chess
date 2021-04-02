import React, { useEffect, useState } from 'react';
import './Home.scss';
import Board from '../../components/board/Board';
import Button from '../../components/button/Button';
import { withRouter } from 'react-router-dom';
import { signInState } from '../../components/side-menu/SideMenu';
import SignUp from '../../components/sign-up/SignUp';

function Home({ history }) {
    const [isSigningUp, setIsSigningUp] = useState(false);
    const transitionDelay = 400;
    const transitionTime = 250;

    function toggleModal () {
        const signUp = document.querySelector('.SignUp');
        const heroSection = document.querySelector('.hero-section');
        const displayName = document.getElementById('display_name');
        signUp.style.transitionDelay = isSigningUp ? '0ms' : `${transitionDelay}ms`;
        heroSection.style.transitionDelay = isSigningUp ? `${transitionDelay}ms` : '0ms';
        signUp.classList.toggle('active');
        heroSection.classList.toggle('hidden');
        if (!isSigningUp) setTimeout(()=> displayName.focus(), transitionDelay + transitionTime);
        setIsSigningUp(!isSigningUp);
    }

    return (
        <div className='HomePage'>
            <div className='hero-section'>
                <h1>FREE ONLINE CHESS</h1>
                <h2>PLAY EASILY WITH ANYONE YOU CHOOSE</h2>
                <p>Invite your friends and play some chess online! Feel free to
                    <b onClick={ toggleModal }> SIGN UP</b> to get cool new features such as having a custom display name, tracking your match history and personal statistics! </p>
                <p>Playing as a guest is also an option - no strings attached. You can hop on and play a quick game anonymously anytime you wish!</p>
                <div>
                    <Button click={()=> signInState.setSingingIn(true) } color='primary'>SIGN IN</Button>
                    <Button click={()=> history.push('/multiplayer') } color='highlight'>PLAY AS A GUEST</Button>
                </div>
            </div>
            <SignUp cancel={ toggleModal }/>
            <Board playable={ false }/>
        </div>
    )
}

export default withRouter(Home);
