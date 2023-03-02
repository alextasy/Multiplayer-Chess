import React, { useContext } from 'react';
import './Home.scss';
import Board from '../../components/board/Board';
import Button from '../../components/button/Button';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import HorizontalLine from '../../components/horizontal-line/HorizontalLine';

function Home() {
    const navigate = useNavigate();
    const { setIsSigningIn, setIsSigningUp, user, isAuth } = useContext(AppContext);

    const defaultFirstP = <p>
        Invite your friends and play some chess online! Feel free to
        <b onClick={() => setIsSigningUp(true) }> SIGN UP</b> to
        get cool new features such as having a custom display name,
        tracking your match history and personal statistics!
    </p>

    const authFirstP = <p>
        Thank you for signing in { user?.displayName }! Feel free to <b>VIEW </b>
        and personalize your profile and explore all of our features.
        You can also analyze your games and keep track
        in our <b> MATCH HISTORY </b> tab.</p>

    const defaultSecondP = <p>
        Playing as a guest is also an option - no strings attached.
        You can hop on and play a quick game anonymously anytime you wish!</p>

    const authSecondP = <p>
        Feeling ready to play some chess? No need to wait any further!
        Explore available rooms or create one yourself. And remember to have fun!
    </p>

    return (
        <div className='HomePage'>
            <div className='hero-section'>
                <h1>FREE ONLINE CHESS</h1>
                <h2>PLAY EASILY WITH ANYONE YOU CHOOSE</h2>
                { isAuth ? authFirstP : defaultFirstP }
                { isAuth ? authSecondP : defaultSecondP }
                <div>
                    <Button
                        click={() => isAuth ? navigate('/multiplayer') : setIsSigningIn(true) }
                        color='primary'>{ isAuth ? 'PLAY NOW' : 'SIGN IN' }</Button>
                    <Button
                        click={()=> navigate('/multiplayer') }
                        color='highlight'>{ isAuth ? 'PERSONALIZE' : 'PLAY AS A GUEST' }</Button>
                </div>
            </div>
            <Board playable={ false }/>
            <HorizontalLine />
        </div>
    )
}

export default Home;
