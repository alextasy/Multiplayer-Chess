import React, { useContext, useRef } from 'react';
import './SideMenu.scss';
import logo from '../../../assets/icons/logo.png';
import HorizontalLine from '../horizontal-line/HorizontalLine';
import Button from '../button/Button';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Auth from '../auth/Auth';

function SideMenu() {
    const {
        isSigningIn, isSigningUp,
        setIsSigningIn, setIsSigningUp,
        isAuth, setIsAuth,
        user, setUser,
    } = useContext(AppContext);
    const sectionRef = useRef(null);

    function signOut() {
        sectionRef.current.classList.toggle('hidden');
        setTimeout(() => {
            sectionRef.current.classList.toggle('hidden');
            localStorage.clear();
            setIsAuth(false);
            setUser(null);
        }, 400);
    }

    const signUpParagraph = <p onClick={() => setIsSigningUp(true) }>Don’t have an account? Sign up!</p>;
    const signOutParagraph = <p onClick={ signOut }>Leave account? Sign out!</p>;

    return (
        <div className='SideMenu'>
            <Link to='/'><img src={ logo } alt='logo'/></Link>
            <HorizontalLine />
            <section className={ isSigningIn || isSigningUp ? 'hidden' : ''} ref={ sectionRef }>
                <h3>PLAY AS { isAuth ? user.displayName.toUpperCase() : 'GUEST' }</h3>
                <Button linkTo='/local'>LOCAL MULTIPLAYER</Button>
                <Button linkTo='/multiplayer'>ONLINE MULTIPLAYER</Button>
                <HorizontalLine />
                <h3>{ isAuth ? 'PERSONAL INFO' : 'SIGN IN TO USE' }</h3>
                <Button linkTo='/history'>MATCH HISTORY</Button>
                <Button linkTo='/profile'>MY PROFILE</Button>
                { isAuth ? null : <Button click={() => setIsSigningIn(true) } color='primary'>SIGN IN</Button> }
                { isAuth ? <Button linkTo='/multiplayer' color='primary'>PLAY NOW</Button> : null }
                { isAuth ? signOutParagraph : signUpParagraph }
            </section>
            { isSigningIn || isSigningUp ? <Auth/> : null }
            <p className='quote'>“Even a poor plan is better than no plan at all.”</p>
        </div>
    )
}

export default SideMenu;
