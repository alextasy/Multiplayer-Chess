import React from 'react'
import './Button.scss';

function Button({ color, children, click }) {
    return (
        <div className={ `Button ${color}` } onClick={ click }>
            { children }
        </div>
    )
}

export default Button;
