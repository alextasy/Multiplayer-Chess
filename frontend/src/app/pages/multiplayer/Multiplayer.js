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
    const { setRoomId } = useContext(GameContext);

    useEffect(()=> {
        socket.on('updateRooms', rooms => setRooms(rooms));
        socket.on('roomJoined', roomId => {
            setRoomId(roomId);
            setInRoom(true);
        });
    }, []);

    function createRoom(options) {
        socket.emit('createRoom', options);
    }

    function joinRoom(roomId) {
        socket.emit('joinRoom', roomId);
    }

    return (
        <div className='Multiplayer'>
            <Board />
            <Aside>
                { inRoom ? <Chat /> : null }
                { inRoom ? <MovesHistory /> : null }
                { inRoom ? null : <JoinRoom rooms={ rooms } joinFunc={ joinRoom } /> }
                { inRoom ? null : <CreateRoom createFunc={ createRoom } /> }
            </Aside>
        </div>
    )
}

export default Multiplayer;
