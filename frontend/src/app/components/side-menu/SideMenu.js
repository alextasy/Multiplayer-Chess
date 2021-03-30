import React, { useRef, useState, useEffect } from 'react';
import './SideMenu.scss';
import logo from '../../../assets/icons/logo.png';
import HorizontalLine from '../horizontal-line/HorizontalLine';
import Button from '../button/Button';
import { withRouter } from 'react-router-dom';

function SideMenu({ history }) {
    const [signingIn, setSigningIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const usernameFieldRef = useRef(null);
    const collapseArrowRef = useRef(null);
    const intervalRef = useRef(null);
    const signInSectionRef = useRef(null);

    const transitionTime = 250;
    const transitionDelay = 400;

    useEffect(() => {
        if (signingIn) {
            setTimeout( () => {
                usernameFieldRef.current.focus();
                intervalRef.current = setInterval(() => collapseArrowRef.current.classList.toggle('active'), 750);
            }, transitionDelay + transitionTime);
        }
        else clearInterval(intervalRef.current);
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
                <Button click={() => history.push('/match-history') }>MATCH HISTORY</Button>
                <Button click={() => history.push('/profile') }>MY PROFILE</Button>
                <Button click={() => setSigningIn(true) } color='primary'>SIGN IN</Button>
                <p onClick={() => history.push('/sign-up') }>Don’t have an account? Sign up!</p>
            </section>
            <div
                ref={ signInSectionRef }
                className={ `sign_in ${signingIn ? 'active' : ''}` }>
                <form autoComplete="off">
                    <div className='input_container'>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='text'
                            name='email'
                            id='email'
                            onChange={ e => setEmail(e.target.value) }
                            value={ email }
                            ref={ usernameFieldRef }>
                        </input>
                    </div>
                    <div className='input_container'>
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            name='password'
                            id='password'
                            onChange={ e => setPassword(e.target.value) }
                            value={ password }>
                        </input>
                    </div>
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
