import React from 'react';
import './Checkbox.scss';

function Checkbox({ state, setState }) {
    return (
        <div className={ `Checkbox ${state ? 'active' : ''}` } onClick={ () => { setState(!state) }}>
            <span className='checkbox-circle' />
        </div>
    )
}

export default Checkbox;
