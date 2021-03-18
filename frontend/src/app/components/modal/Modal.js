import React from 'react';
import './Modal.scss';

export const closeModal = closeFunction => {
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalContainer = document.querySelector('.modal-container');
    modalOverlay.style.pointerEvents = 'none'; //Prevents from reseting the funciton when being clicked.
    modalOverlay.style.animation = 'none';
    modalContainer.style.animation = 'none';
    //Using timer to reset animations because strangely enough there is no good way to do that.
    setTimeout(()=> {
        modalOverlay.style.animation = 'fade_in 500ms ease-out alternate-reverse forwards';
        modalContainer.style.animation = 'slide 500ms ease-out alternate-reverse forwards';
    }, 100);
    //Removes the element from the DOM
    modalOverlay.addEventListener('animationend',  closeFunction);
}

function Modal({children, close}) {
    return (
        <div className='Modal'>
            <div className='modal-overlay' onClick={ ()=> { if (close) closeModal(close) }}></div>
            <div className={'modal-container'}>{ children }</div>
        </div>
    )
}

export default Modal;
