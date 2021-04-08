import React from 'react';
import './Radio.scss';

function Radio({ children, condition, name, id, change }) {
    return (
        <div className={ `Radio ${condition ? 'active' : ''}` }>
            <span className='radio_circle' />
            <input
                id={ id }
                type='radio'
                name={ name }
                checked={ condition }
                onChange={ change } />
            <label htmlFor={ id }>{ children }</label>
        </div>
    )
}

export default Radio;
