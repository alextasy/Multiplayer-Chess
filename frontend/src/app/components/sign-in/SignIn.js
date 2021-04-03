import React, { useContext, useState, useEffect, useRef } from 'react';
import './SignIn.scss';
import Input from '../input/Input';
import Button from '../button/Button';
import { AppContext} from '../../context/AppContext';
import CollapseArrow from '../collapse-arrow/CollapseArrow';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isSigningIn, setIsSigningIn } = useContext(AppContext);
    const signInRef = useRef();
    const inputRef = useRef();
    const transitionTime = 250;
    const transitionDelay = 400;

    useEffect(() => {
        signInRef.current.style.transitionDelay = `${ transitionDelay }ms`;
        signInRef.current.classList.toggle('active');
        if (isSigningIn) setTimeout(() => inputRef.current.focus(), transitionTime + transitionDelay);
    });

    const collapseFunction = () => {
        signInRef.current.style.transitionDelay = `0ms`;
        signInRef.current.classList.remove('active');
        setTimeout(() => setIsSigningIn(false), transitionDelay);
    }

    return (
        <div className='SignIn' ref={ signInRef }>
            <form autoComplete="off">
                <Input
                    reference={ inputRef }
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
            </form>
            <CollapseArrow collapse={ collapseFunction }>COLLAPSE</CollapseArrow>
        </div>
    )
}

export default SignIn;
