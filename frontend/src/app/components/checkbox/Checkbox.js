import React, { useState, useEffect, useRef } from 'react';
import './Checkbox.scss';

function Checkbox({ click, checkedInitially }) {
    const [isChecked, setIsChecked] = useState(checkedInitially);
    const element = useRef(null);

    useEffect (()=> {
        // Add transition asynchronously to not trigger it by setting the initial state
        setTimeout(()=> element.current.firstChild.style.transition = 'transform 150ms ease-in', 100);
    }, []);

    useEffect(() => {
        if (isChecked) element.current.classList.add('active');
        else element.current.classList.remove('active');
    }, [isChecked]);

    return (
        <div
            className='Checkbox'
            onClick={ () => { click(); setIsChecked(!isChecked) }}
            ref={element}>
            <span className='thumb'></span>
        </div>
    )
}

export default Checkbox;
