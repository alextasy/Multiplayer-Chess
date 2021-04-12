const { v4: uuidv4 } = require('uuid');

module.exports = io => {
    let rooms = [];

    io.on('connection', socket => {

        socket.on('requestRooms', () => socket.emit('updateRooms', rooms));

        socket.on('createRoom', options => {
            const roomId = uuidv4();
            rooms.push({ ...options, id: roomId });
            socket.join(roomId);
            socket.emit('roomJoined', roomId);
            socket.broadcast.emit('updateRooms', rooms);
        })

        socket.on('joinRoom', roomId => {
            socket.join(roomId);
            socket.emit('roomJoined', roomId);
            io.emit('gameStart');
            rooms = rooms.filter(room => room.id !== roomId);
            io.emit('updateRooms', rooms);
        })

        socket.on('message', ({ message, sender, roomId }) => {
            io.to(roomId).emit('message', { message, sender });
        })

        socket.on('move', ({ figIndex, nextSquareIndex, roomId }) => {
            socket.broadcast.to(roomId).emit('move', { figIndex, nextSquareIndex });
        })
    });
}
