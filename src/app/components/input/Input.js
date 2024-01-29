import React, { useEffect, useRef } from 'react';
import './Input.scss';

function Input({ children, id, changeState, type = 'text', reference, invalidMsg, placeholder, enterPressed }) {
    const ref = useRef();
    useEffect(() =>{
        if (!reference) return;
        reference.current = ref.current;
    }, [reference]);

    return (
        <div className={`Input ${invalidMsg ? 'invalid' : '' }`}>
            { children ? <label htmlFor={ id }>{ children }</label> : null }
            <input
                type={ type }
                name={ id }
                id={ id }
                onChange={ e => changeState[1](e.target.value) }
                value={ changeState[0] }
                placeholder={ placeholder }
                ref={ ref }
                autoComplete='off'
                onKeyDown={e => e.key === 'Enter' && enterPressed && enterPressed() }>
            </input>
            <div className='invalid-message'>{ invalidMsg }</div>
        </div>
    )
}

export default Input;
