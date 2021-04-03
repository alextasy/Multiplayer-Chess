import React, { useContext, useEffect, useRef, useState } from 'react';
import './Auth.scss';
import Button from '../button/Button';
import Input from '../input/Input';
import { AppContext} from '../../context/AppContext';
import CollapseArrow from '../collapse-arrow/CollapseArrow';

function SignUp() {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const { isSigningIn, setIsSigningIn, isSigningUp, setIsSigningUp } = useContext(AppContext);
    const authRef = useRef();
    const transitionTime = 250;
    const transitionDelay = 400;

    useEffect(() => {
        const input = authRef.current.firstChild;
        authRef.current.style.transitionDelay = `${ transitionDelay }ms`;
        authRef.current.classList.toggle('active');
        if (isSigningUp) setTimeout(() => input.focus(), transitionTime + transitionDelay);
    });

    const collapseFunction = () => {
        authRef.current.style.transitionDelay = `0ms`;
        authRef.current.classList.remove('active');
        setTimeout(() => isSigningUp ? setIsSigningUp(false) : setIsSigningIn(false), transitionDelay);
    }
    const displayNameEl = <Input id='display_name' changeState={[ displayName, setDisplayName ]}>Display name</Input>;
    const repeatPasswordEl = <Input id='repeat_password' changeState={[ repeatPassword, setRepeatPassword ]}>Repeat password</Input>

    return (
        <div className='Auth' ref={ authRef }>
            <form autoComplete='off'>
                { isSigningUp ? displayNameEl : null }
                <Input id='email' changeState={[ email, setEmail ]} >Email</Input>
                <Input id='password' changeState={[ password, setPassword ]}>Password</Input>
                { isSigningUp ? repeatPasswordEl : null }
                <Button color='primary'>{ isSigningUp ? 'SIGN UP' : 'SIGN IN' }</Button>
            </form>
            <CollapseArrow collapse={ collapseFunction }>COLLAPSE</CollapseArrow>
        </div>
    )
}

export default SignUp;
