import React from 'react'
import './Button.scss';

function Button({ color, children, click }) {
    return (
        <button className={ `Button ${color ? color : ''}` } onClick={ click }>
            { children }
        </button>
    )
}

export default Button;
