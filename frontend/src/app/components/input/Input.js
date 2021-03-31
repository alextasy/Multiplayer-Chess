import React from 'react';
import './Input.scss';

function Input({ children, id, changeState, type = 'text' }) {
    return (
        <div className='Input'>
            <label htmlFor={ id }>{ children }</label>
            <input
                type={ type }
                name={ id }
                id={ id }
                onChange={ e => changeState[1](e.target.value) }
                value={ changeState[0] }>
            </input>
        </div>
    )
}

export default Input;
