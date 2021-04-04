import React, { useEffect, useRef } from 'react';
import './Input.scss';

function Input({ children, id, changeState, type = 'text', reference, invalidMsg }) {
    const ref = useRef();
    useEffect(() =>{
        if (!reference) return;
        reference.current = ref.current;
    }, [reference]);

    return (
        <div className={`Input ${invalidMsg ? 'invalid' : '' }`}>
            <label htmlFor={ id }>{ children }</label>
            <input
                type={ type }
                name={ id }
                id={ id }
                onChange={ e => changeState[1](e.target.value) }
                value={ changeState[0] }
                ref={ ref }>
            </input>
            <div className='invalid-message'>{ invalidMsg }</div>
        </div>
    )
}

export default Input;
