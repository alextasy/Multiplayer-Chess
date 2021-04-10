import React, { useContext, useEffect, useRef, useState } from 'react';
import Aside from '../../components/aside/Aside';
import Board from '../../components/board/Board';
import CreateRoom from '../../components/create-room/CreateRoom';
import JoinRoom from '../../components/join-room/JoinRoom';
import './Multiplayer.scss';
import { socket } from '../../../helpers/Socket';

function Multiplayer() {
    const [rooms, setRooms] = useState([]);

    useEffect(()=> { socket.on('updateRooms', rooms => setRooms(rooms)) }, []);

    function createRoom(options) {
        socket.emit('createRoom', options);
    }

    return (
        <div className='Multiplayer'>
            <Board />
            <Aside>
                <JoinRoom rooms={ rooms }/>
                <CreateRoom createFunc={ createRoom }/>
            </Aside>
        </div>
    )
}

export default Multiplayer;
