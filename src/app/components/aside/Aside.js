import React from 'react';
import './Aside.scss';

function Aside({ children }) {
    return (
        <aside className='Aside'>
            { children }
        </aside>
    )
}

export default Aside;
