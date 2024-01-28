const { v4: uuidv4 } = require('uuid');

module.exports = io => {
    let rooms = [];
    let inGameRooms = [];

    io.on('connection', socket => {

        function filterRooms(roomId = null) {
            rooms = rooms.filter(room => room.creatorId !== socket.id && room.id !== roomId);
            io.emit('updateRooms', rooms);
        }

        socket.on('requestRooms', () => socket.emit('updateRooms', rooms));

        socket.on('createRoom', options => {
            const roomId = uuidv4();
            rooms.push({ ...options, id: roomId, creatorId: socket.id });
            socket.join(roomId);
            socket.emit('roomJoined', roomId);
            socket.broadcast.emit('updateRooms', rooms);
        })

        socket.on('joinRoom', roomId => {
            socket.join(roomId);
            socket.emit('roomJoined', roomId);
            io.emit('gameStart');
            const room = rooms.find(room => room.id === roomId);
            room.visitorId = socket.id;
            inGameRooms.push(room);
            filterRooms(roomId);
        })

        socket.on('message', ({ message, sender, roomId }) => {
            io.to(roomId).emit('message', { message, sender });
        })

        socket.on('move', ({ figIndex, nextSquareIndex, roomId }) => {
            socket.broadcast.to(roomId).emit('move', { figIndex, nextSquareIndex });
        })

        socket.on('leftRoom', filterRooms);
        socket.on('disconnect', () => {
            filterRooms();
            const roomPlayerWasIn = inGameRooms.find(room => room.visitorId === socket.id || room.creatorId === socket.id);
            if (!roomPlayerWasIn) return;
            io.to(roomPlayerWasIn.id).emit('opponentDisconnected');
            inGameRooms = inGameRooms.filter(room => room.id !== roomPlayerWasIn.id);
        });

        socket.on('gameOver', roomId => {
            inGameRooms = inGameRooms.filter(room => room.id !== roomId)
        });
    });
}
