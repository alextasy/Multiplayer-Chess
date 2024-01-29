import React from 'react'
import { Link } from 'react-router-dom';
import './Button.scss';

function Button({ color, children, click, linkTo }) {
    function handleClick(e) {
        e.preventDefault();
        if (click) click();
    }

    return (linkTo
        ?<Link to={linkTo} onClick={ ()=> click && click() } className={ `Button ${color ? color : ''}` }>{ children }</Link>
        :<button className={ `Button ${color ? color : ''}` } onClick={ handleClick }>{ children }</button>
    )
}

export default Button;
