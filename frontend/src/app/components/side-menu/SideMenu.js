import React, { useContext, useRef } from 'react';
import './SideMenu.scss';
import logo from '../../../assets/icons/logo.png';
import HorizontalLine from '../horizontal-line/HorizontalLine';
import Button from '../button/Button';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import ChangeName from '../change-name/ChangeName';

function SideMenu() {
    const {
        isChangingName,
        setIsChangingName,
        userDisplayName
    } = useContext(AppContext);
    const sectionRef = useRef(null);

    return (
        <div className='SideMenu'>
            <Link to='/'><img src={ logo } alt='logo'/></Link>
            <HorizontalLine />
            <section className={ isChangingName ? 'hidden' : ''} ref={ sectionRef }>
                <h3>GAME MODES</h3>
                <Button linkTo='/local'>LOCAL PLAY</Button>
                <Button linkTo='/multiplayer'>ONLINE MULTIPLAYER</Button>
                <HorizontalLine />
                <h3 className='no-margin-bottom' >PLAYING AS:</h3>
                <b>{ userDisplayName }</b>
                <Button click={() => setIsChangingName(true) } color='primary'>CHANGE NAME</Button>
            </section>
            { isChangingName ? <ChangeName/> : null }
            <p className='quote'>“Even a poor plan is better than no plan at all.”</p>
        </div>
    )
}

export default SideMenu;
