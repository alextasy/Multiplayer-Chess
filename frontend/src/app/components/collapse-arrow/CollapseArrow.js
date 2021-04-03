import React, { useRef } from 'react';
import './CollapseArrow.scss';

function ColapseArrow({ collapse, children }) {
    const arrowRef = useRef(null);
    const intervalRef = useRef(
        setInterval(() => {
            //prevents from trying to access the element before it's loaded
            if (!arrowRef.current) return;
            arrowRef.current.classList.toggle('active');
        }, 750)
    );

    function collapseFunction() {
        clearInterval(intervalRef.current);
        collapse();
    }

    return (
        <div className='CollapseArrow' onClick={ collapseFunction }>
            <p>{ children }</p>
            <p class='arrow' ref={ arrowRef }></p>
        </div>
    )
}

export default ColapseArrow;
