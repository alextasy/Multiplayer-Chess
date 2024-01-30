import React, { useContext, useEffect, useState } from 'react';
import Aside from '../../components/aside/Aside';
import Board from '../../components/board/Board';
import CreateRoom from '../../components/create-room/CreateRoom';
import JoinRoom from '../../components/join-room/JoinRoom';
import './Multiplayer.scss';
import { socket } from '../../../helpers/Socket';
import Chat from '../../components/chat/Chat';
import MovesHistory from '../../components/moves-history/MovesHistory';
import { GameContext } from '../../context/GameContext';

function Multiplayer() {
    const [rooms, setRooms] = useState([]);
    const [inRoom, setInRoom] = useState(false);
    const [playerIsBlack, setPlayerIsBlack] = useState(false);
    const { roomId, setRoomId, inGame, setInGame } = useContext(GameContext);
    const [key, SetKey] = useState(new Date().getTime()); // Setting unique key resets the state

    useEffect(()=> {
        socket.emit('requestRooms');
        socket.on('updateRooms', rooms => setRooms(rooms));
        socket.on('roomJoined', roomId => {
            setRoomId(roomId);
            setInRoom(true);
        });
        socket.on('gameStart', () => {
            SetKey(new Date().getTime());
            setInGame(true)
        });
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
        socket.emit('joinRoom', roomId);
        if (!creatorIsBlack) setPlayerIsBlack(true);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }

    function handleGameOver() {
        SetKey(new Date().getTime());
        socket.emit('gameOver', roomId);
        setInRoom(false);
        setRoomId('');
        setInGame(false);
        setPlayerIsBlack(false);
    }

    return (
        <div className='Multiplayer'>
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
