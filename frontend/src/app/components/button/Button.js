import React from 'react'
import './Button.scss';

function Button({ color, children, click }) {
    let border = null;
    const bgColor = color ? applyColor() : null;

    function applyColor() {
        switch(color){
            case 'primary': border = '2px solid #537133';return '#7fa650';
            case 'backgroundDark': return '#272522';
            //returns background color by default
            default: return '#312e2b';
        };
    }

    return (
        <div className='Button' style={{ backgroundColor: bgColor, borderBottom: border }} onClick={ click }>
            { children }
        </div>
    )
}

export default Button;
