import React, { useContext, useEffect, useRef, useState } from 'react';
import Aside from '../../components/aside/Aside';
import Board from '../../components/board/Board';
import CreateRoom from '../../components/create-room/CreateRoom';
import JoinRoom from '../../components/join-room/JoinRoom';
import './Multiplayer.scss';
import { socket } from '../../../helpers/Socket';
import Chat from '../../components/chat/Chat';
import MovesHistory from '../../components/moves-history/MovesHistory';
import { GameContext } from '../../context/GameContext';
import { AppContext } from '../../context/AppContext';

function Multiplayer() {
    const [rooms, setRooms] = useState([]);
    const [inRoom, setInRoom] = useState(false);
    const [playerIsBlack, setPlayerIsBlack] = useState(false);
    const { userUuid } = useContext(AppContext);
    const { roomId, setRoomId, inGame, setInGame } = useContext(GameContext);
    const [key, SetKey] = useState(new Date().getTime()); // Setting unique key resets the state
    const roomStateRef = useRef({ inGame, roomId }); // Needed for real values when checking in event handlers
    const [gameStartedAlertState, setGameStartedAlertState] = useState(false);

    useEffect(()=> {
        socket.emit('requestRooms');
        socket.on('updateRooms', rooms => setRooms(rooms));
        socket.on('roomJoined', roomId => {
            if (roomStateRef.current.roomId === roomId) return;
            roomStateRef.current.roomId = roomId;
            setRoomId(roomId);
            setInRoom(true);
        });
        socket.on('gameStart', startGame);
        socket.on('verifyStillInRoom', roomPlayerWasInId => {
            if (roomPlayerWasInId === roomStateRef.current.roomId) socket.emit('verifyStillInRoom');
        });
        socket.on('verifyGameStarted', startGame);
    }, []);

    // Clean up
    useEffect(()=> () => inRoom ? socket.emit('leftRoom', roomId) : null, [inRoom]);
    useEffect(()=> () => socket.removeAllListeners(), []);

    function createRoom(options) {
        socket.emit('createRoom', options);
        if (options.creatorIsBlack) setPlayerIsBlack(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }

    function joinRoom(roomId, creatorIsBlack) {
        socket.emit('joinRoom', roomId, userUuid);
        if (!creatorIsBlack) setPlayerIsBlack(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }

    function startGame() {
        if (roomStateRef.current.inGame) return;
        roomStateRef.current.inGame = true; 
        SetKey(new Date().getTime());
        setInGame(true);
        setGameStartedAlertState(true);
    }

    function handleGameOver() {
        SetKey(new Date().getTime());
        socket.emit('gameOver', roomId);
        setInRoom(false);
        setRoomId('');
        setInGame(false);
        setPlayerIsBlack(false);
        roomStateRef.current = { inGame: false, roomId: '' };
    }

    const gameStartedAlert = <div className='game-started-alert'>
        <h2>GAME STARTED</h2>
        <p>{ playerIsBlack ? 'Wait for opponent to make a move...' : 'It\'s your turn, make the move' }</p>
        <p>Good luck! Have fun!</p>
    </div>

    return (
        <div className='Multiplayer'>
            { gameStartedAlertState ? gameStartedAlert : null }
            <Board key={key} playable={ inGame } playingAsBlack={ playerIsBlack } handleGameOver={ handleGameOver } />
            <Aside>
                { inRoom ? <Chat initialMsg={ inGame ? null : 'Waiting for opponent to join...' }/> : null }
                { inRoom ? <MovesHistory /> : null }
                { inRoom ? null : <JoinRoom rooms={ rooms } joinFunc={ joinRoom } /> }
                { inRoom ? null : <CreateRoom rooms={ rooms } createFunc={ createRoom } /> }
            </Aside>
        </div>
    )
}

export default Multiplayer;
