import React, { useContext, useEffect, useRef, useState } from 'react';
import './ChangeName.scss';
import Button from '../button/Button';
import Input from '../input/Input';
import { AppContext } from '../../context/AppContext';
import CollapseArrow from '../collapse-arrow/CollapseArrow';

function SignUp() {
    const [form, setForm] = useState({ displayName: '', invalidDisplayName: '', });
    const { isChangingName, setIsChangingName, setUserDisplayName } = useContext(AppContext);
    const ref = useRef();
    const transitionTime = 250;
    const transitionDelay = 400;
    const displayNameRegex= /^[A-Za-z0-9]{4,}$/

    useEffect(() => {
        // Gets the first input of the form - display name
        const input = ref.current.querySelector('input');
        ref.current.style.transitionDelay = `${ transitionDelay }ms`;
        setTimeout(() => {
            if (isChangingName) ref.current.classList.add('active');
            else ref.current.classList.remove('active'); 
        });
        setTimeout(() => input.focus(), transitionTime + transitionDelay);
    }, [isChangingName]);

    const collapseFunction = () => {
        ref.current.style.transitionDelay = `0ms`;
        ref.current.classList.remove('active');
        setTimeout(() => setIsChangingName(false), transitionDelay);
    }

    function saveDisplayName() {
        const formCopy = { ...form };
        if (!displayNameRegex.test(form.displayName)) formCopy.invalidDisplayName = '* Can only include letters and numbers';
        if (form.displayName.length < 4) formCopy.invalidDisplayName = '* Minimum length is 4 characters';
        if (!form.displayName) formCopy.invalidDisplayName = '* Field is required';

        // Checks if any of the invalid message fields are truthy
        if (Object.keys(formCopy).some(field => formCopy[field] && field.startsWith('invalid'))) return setForm(formCopy);
        
        setUserDisplayName(form.displayName);
        collapseFunction();
    }

    return (
        <div className='ChangeName'>
            <div className='form-container' ref={ ref }>
                <form autoComplete='off'>
                    <Input
                        id='display_name'
                        changeState={[ form.displayName, displayName => setForm({ ...form, displayName, invalidDisplayName: '' }) ]}
                        invalidMsg={ form.invalidDisplayName }
                        >Display name:
                    </Input>
                    <Button color='primary' click={ saveDisplayName }>SAVE</Button>
                </form>
                <CollapseArrow collapse={ collapseFunction }>CANCEL</CollapseArrow>
            </div>
        </div>
    )
}

export default SignUp;
