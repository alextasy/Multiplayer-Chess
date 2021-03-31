import React, { useState } from 'react';
import Input from '../../components/input/Input';
import Board from '../../components/board/Board';
import './SignUp.scss';

function SignUp() {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [quote, setQuote] = useState('');
    const [bio, setBio] = useState('');

    return (
        <div className='SignUp'>
            {/* TODO: USER AVATAR */}
            <Board />
            <form autoComplete='off'>
                <h1>SIGN UP</h1>
                <Input id='display_name' changeState={[ displayName, setDisplayName ]}>Display name</Input>
                <Input id='sign_up_email' changeState={[ email, setEmail ]}>Email</Input>
                <Input id='sign_up_password' changeState={[ password, setPassword ]}>Password</Input>
                <Input id='repeat_password' changeState={[ repeatPassword, setRepeatPassword ]}>Repeat password</Input>
                <h3>PERSONALIZE</h3>
                <Input id='quote' changeState={[ quote, setQuote ]}>Quote (optional)</Input>
                <Input id='bio' changeState={[ bio, setBio ]}>Bio (optional)</Input>
            </form>
        </div>
    )
}

export default SignUp;
