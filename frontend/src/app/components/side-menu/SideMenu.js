import React, { useRef, useState, useEffect, useContext } from 'react';
import './SideMenu.scss';
import logo from '../../../assets/icons/logo.png';
import HorizontalLine from '../horizontal-line/HorizontalLine';
import Button from '../button/Button';
import { withRouter } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import SignIn from '../sign-in/SignIn';

function SideMenu({ history }) {
    const { isSigningIn, isSigningUp, setIsSigningIn, setIsSigningUp } = useContext(AppContext);

    return (
        <div className='SideMenu'>
            <img src={ logo } alt='logo' onClick={ ()=> history.push('/') } style={{ cursor: 'pointer' }}/>
            <HorizontalLine />
            <section className={ isSigningIn ? 'hidden' : ''}>
                <h3>PLAY AS GUEST</h3>
                <Button click={() => history.push('/local') }>LOCAL MULTIPLAYER</Button>
                <Button click={() => history.push('/multiplayer') }>ONLINE MULTIPLAYER</Button>
                <HorizontalLine />
                <h3>SIGN IN TO USE</h3>
                <Button click={() => history.push('/history') }>MATCH HISTORY</Button>
                <Button click={() => history.push('/profile') }>MY PROFILE</Button>
                <Button click={() => setIsSigningIn(true) } color='primary'>SIGN IN</Button>
                <p onClick={() => history.push('/signup') }>Don’t have an account? Sign up!</p>
            </section>
            { isSigningIn ? <SignIn /> : null }
            <p className='quote'>“Even a poor plan is better than no plan at all.”</p>
        </div>
    )
}

export default withRouter(SideMenu);
