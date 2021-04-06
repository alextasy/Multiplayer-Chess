import React, { useContext, useEffect, useRef, useState } from 'react';
import './Auth.scss';
import Button from '../button/Button';
import Input from '../input/Input';
import { AppContext } from '../../context/AppContext';
import CollapseArrow from '../collapse-arrow/CollapseArrow';
import { fetchRequest } from '../../../helpers/FetchHelper';

function SignUp() {
    const [form, setForm] = useState({
        displayName: '', invalidDisplayName: '',
        email: '', invalidEmail: '',
        password: '', invalidPassword: '',
        repeatPassword: '', invalidRepeatPassword: '',
    });
    const { isSigningIn, setIsSigningIn, isSigningUp, setIsSigningUp } = useContext(AppContext);
    const authRef = useRef();
    const transitionTime = 250;
    const transitionDelay = 400;
    const emailRegex = /^\S+@\S+\.\S+$/;
    const passwordRegex = /(?=.*[a-z])(?=.*[0-9]).{5,}/;
    const displayNameRegex= /^[A-Za-z0-9]{5,}$/

    useEffect(() => {
        // Gets the first input of the form - display name if signing up or email if signing in
        const input = authRef.current.querySelector('input');
        authRef.current.style.transitionDelay = `${ transitionDelay }ms`;
        authRef.current.classList.toggle('active');
        setTimeout(() => input.focus(), transitionTime + transitionDelay);
    }, [isSigningIn, isSigningUp]);

    const collapseFunction = () => {
        authRef.current.style.transitionDelay = `0ms`;
        authRef.current.classList.remove('active');
        setTimeout(() => isSigningUp ? setIsSigningUp(false) : setIsSigningIn(false), transitionDelay);
    }

    function validateEmailAndPassword() {
        let formCopy = { ...form };
        if (!emailRegex.test(form.email)) formCopy.invalidEmail ='* Invalid email';
        if (!form.email) formCopy.invalidEmail = '* Field is required';
        if (!passwordRegex.test(form.password)) formCopy.invalidPassword = '* Must include a letter and a number';
        if (form.password.length < 6) formCopy.invalidPassword = '* Minimum length is 6 characters';
        if (!form.password) formCopy.invalidPassword = '* Field is required';

        if (isSigningUp) return validateSignUp(formCopy);
        if ( formCopy.invalidEmail || formCopy.invalidPassword) return setForm(formCopy);

        fetchRequest('login', { email: form.email, password: form.password }).then(async res => {
            const resObj = await res.json();
            if (res.status === 404) return setForm({ ...form, ...resObj });
            // TODO: save token in cache, change app state to be auth
        });
    }

    function validateSignUp(formCopy) {
        if (!displayNameRegex.test(form.displayName)) formCopy.invalidDisplayName = '* Can only include letters and numbers';
        if (form.displayName.length < 6) formCopy.invalidDisplayName = '* Minimum length is 6 characters';
        if (!form.displayName) formCopy.invalidDisplayName = '* Field is required';
        if (form.password !== form.repeatPassword) formCopy.invalidRepeatPassword = '* Passwords must match';
        if (!form.repeatPassword) formCopy.invalidRepeatPassword = '* Field is required';
        // Checks if any of the invalid message fields are truthy
        if (Object.keys(formCopy).some(field => formCopy[field] && field.startsWith('invalid'))) return setForm(formCopy);

        fetchRequest('register', {
            displayName: form.displayName,
            email: form.email,
            password: form.password,
        }).then(async res => {
            const resObj = await res.json();
            if (res.status === 404) return setForm({ ...form, ...resObj });
            // TODO: save token in cache, change app state to be auth
        });
    }

    const displayNameEl =
        <Input
            id='display_name'
            changeState={[ form.displayName, displayName => setForm({ ...form, displayName, invalidDisplayName: '' }) ]}
            invalidMsg={ form.invalidDisplayName }
            >Display name
        </Input>;

    const repeatPasswordEl =
        <Input
            id='repeat_password'
            type='password'
            changeState={[ form.repeatPassword, repeatPassword => setForm({ ...form, repeatPassword, invalidRepeatPassword: '' }) ]}
            invalidMsg={ form.invalidRepeatPassword }
            >Repeat password
        </Input>

    return (
        <div className='Auth' ref={ authRef }>
            <form autoComplete='off'>
                { isSigningUp ? displayNameEl : null }
                <Input
                    id='email'
                    changeState={[ form.email, email => setForm({ ...form, email, invalidEmail: '' }) ]}
                    invalidMsg={ form.invalidEmail }
                    >Email
                </Input>
                <Input
                    id='password'
                    type='password'
                    changeState={[ form.password, password => setForm({ ...form, password, invalidPassword: ''}) ]}
                    invalidMsg={ form.invalidPassword }
                    >Password
                </Input>
                { isSigningUp ? repeatPasswordEl : null }
                <Button color='primary' click={ validateEmailAndPassword }>{ isSigningUp ? 'SIGN UP' : 'SIGN IN' }</Button>
            </form>
            <CollapseArrow collapse={ collapseFunction }>COLLAPSE</CollapseArrow>
        </div>
    )
}

export default SignUp;
