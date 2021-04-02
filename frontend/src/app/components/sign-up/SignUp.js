import React, { useState } from 'react';
import Button from '../button/Button';
import Input from '../input/Input';
import './SignUp.scss';
import logo from '../../../assets/icons/logo.png'
import HorizontalLine from '../horizontal-line/HorizontalLine';

function SignUp({ cancel }) {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    return (
        <div className='SignUp'>
            <form autoComplete='off'>
                <img src={ logo } alt='Logo'/>
                <HorizontalLine width='100%'/>
                <Input id='display_name' changeState={[ displayName, setDisplayName ]}>Display name</Input>
                <Input id='sign_up_email' changeState={[ email, setEmail ]}>Email</Input>
                <Input id='sign_up_password' changeState={[ password, setPassword ]}>Password</Input>
                <Input id='repeat_password' changeState={[ repeatPassword, setRepeatPassword ]}>Repeat password</Input>
                <div className='controls'>
                    <Button color='primary'>SUBMIT</Button>
                    <Button color='background' click={ cancel }>CANCEL</Button>
                </div>
            </form>
        </div>
    )
}

export default SignUp;
