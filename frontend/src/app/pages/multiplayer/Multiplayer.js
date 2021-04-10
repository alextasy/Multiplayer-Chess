import React, { useEffect, useState } from 'react';
import Aside from '../../components/aside/Aside';
import Board from '../../components/board/Board';
import CreateRoom from '../../components/create-room/CreateRoom';
import JoinRoom from '../../components/join-room/JoinRoom';
import './Multiplayer.scss';
import { socket } from '../../../helpers/Socket';

function Multiplayer() {
    const [rooms, setRooms] = useState([]);

    useEffect(()=> {
        socket.on('updateRooms', rooms => setRooms(rooms));
        socket.on('hey', hey => console.log(hey));
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
                <JoinRoom rooms={ rooms } joinFunc={ joinRoom }/>
                <CreateRoom createFunc={ createRoom }/>
            </Aside>
        </div>
    )
}

export default Multiplayer;
