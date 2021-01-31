import React from 'react';
import './SideMenu.scss';
import logo from '../../../assets/icons/logo.png';
import HorizontalLine from '../horizontal-line/HorizontalLine';
import Button from '../button/Button';
import { withRouter } from 'react-router-dom';

function SideMenu({ history }) {
    return (
        <div className='SideMenu'>
            <img src={logo} alt='logo'/>
            <HorizontalLine />
            <h3>PLAY AS GUEST</h3>
            <Button click={()=> history.push('/local')}>LOCAL MULTIPLAYER</Button>
            <Button click={()=> history.push('/create-a-room')}>ONLINE MULTIPLAYER</Button>
            <HorizontalLine />
            <h3>SIGN IN TO USE</h3>
            <Button click={()=> history.push('/match-history')}>MATCH HISTORY</Button>
            <Button click={()=> history.push('/profile')}>MY PROFILE</Button>
            <Button click={()=> history.push('/sign-in')} color='primary'>SIGN IN</Button>
            <p onClick={()=> history.push('/sign-up')}>Don’t have an account? Sign up!</p>
            <p className='quote'>“Even a poor plan is better than no plan at all.”</p>
        </div>
    )
}

export default withRouter(SideMenu);
