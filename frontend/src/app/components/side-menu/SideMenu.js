import React, { useRef, useState, useEffect } from 'react';
import './SideMenu.scss';
import logo from '../../../assets/icons/logo.png';
import HorizontalLine from '../horizontal-line/HorizontalLine';
import Button from '../button/Button';
import { withRouter } from 'react-router-dom';
import Input from '../input/Input';

export const signInState = { setSigningIn: () => {} };

function SideMenu({ history }) {
    const [signingIn, setSigningIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const collapseArrowRef = useRef(null);
    const intervalRef = useRef(null);
    const signInSectionRef = useRef(null);

    const transitionTime = 250;
    const transitionDelay = 400;

    signInState.setSingingIn = setSigningIn;

    useEffect(() => {
        if (!signingIn) return clearInterval(intervalRef.current);
        setTimeout(() => {
            document.getElementById('email').focus();
            intervalRef.current = setInterval(() => collapseArrowRef.current.classList.toggle('active'), 750);
        }, transitionDelay + transitionTime);
    }, [signingIn]);

    const collapseFunction = () => {
        signInSectionRef.current.style.transitionDelay = '0ms';
        signInSectionRef.current.classList.remove('active');
        setTimeout(() => {
            signInSectionRef.current.style.transitionDelay = `${transitionDelay}ms`;
            setSigningIn(false)
        }, transitionDelay);
    }

    return (
        <div className='SideMenu'>
            <img src={ logo } alt='logo' onClick={ ()=> history.push('/') } style={{ cursor: 'pointer' }}/>
            <HorizontalLine />
            <section className={ signingIn ? 'hidden' : ''}>
                <h3>PLAY AS GUEST</h3>
                <Button click={() => history.push('/local') }>LOCAL MULTIPLAYER</Button>
                <Button click={() => history.push('/multiplayer') }>ONLINE MULTIPLAYER</Button>
                <HorizontalLine />
                <h3>SIGN IN TO USE</h3>
                <Button click={() => history.push('/history') }>MATCH HISTORY</Button>
                <Button click={() => history.push('/profile') }>MY PROFILE</Button>
                <Button click={() => setSigningIn(true) } color='primary'>SIGN IN</Button>
                <p onClick={() => history.push('/signup') }>Don’t have an account? Sign up!</p>
            </section>
            <div
                ref={ signInSectionRef }
                className={ `sign_in ${signingIn ? 'active' : ''}` }>
                <form autoComplete="off">
                    <Input
                        type='email'
                        id='email'
                        changeState={[ email, setEmail ]}>Email
                    </Input>
                    <Input
                        type='password'
                        id='password'
                        changeState={[ password, setPassword ]}>Password
                    </Input>
                    <Button color='primary'>SIGN IN</Button>
                    <div className='collapse' onClick={ collapseFunction }>
                        <p>COLLAPSE</p>
                        <p id='arrow' ref={ collapseArrowRef }></p>
                    </div>
                </form>
            </div>
            <p className='quote'>“Even a poor plan is better than no plan at all.”</p>
        </div>
    )
}

export default withRouter(SideMenu);
