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
    const { setRoomId, inGame, setInGame } = useContext(GameContext);

    useEffect(()=> {
        socket.emit('requestRooms');
        socket.on('updateRooms', rooms => setRooms(rooms));
        socket.on('roomJoined', roomId => {
            setRoomId(roomId);
            setInRoom(true);
        });
        socket.on('gameStart', () => setInGame(true));
    }, []);

    function createRoom(options) {
        socket.emit('createRoom', options);
        if (options.creatorIsBlack) setPlayerIsBlack(true);
    }

    function joinRoom(roomId, creatorIsBlack) {
        socket.emit('joinRoom', roomId);
        if (!creatorIsBlack) setPlayerIsBlack(true);
    }

    return (
        <div className='Multiplayer'>
            <Board playable={ inGame } playingAsBlack={ playerIsBlack } />
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
