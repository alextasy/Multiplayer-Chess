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
                onChange={ e => changeState.setValue(e.target.value) }
                value={ changeState.value }>
            </input>
        </div>
    )
}

export default Input;
