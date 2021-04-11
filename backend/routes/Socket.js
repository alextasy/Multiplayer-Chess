
module.exports = io => {
    let rooms = [];

    io.on('connection', socket => {

        socket.on('requestRooms', () => socket.emit('updateRooms', rooms));

        socket.on('createRoom', options => {
            rooms.push({ ...options, id: socket.id });
            socket.join(socket.id);
            socket.emit('roomJoined', socket.id);
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
    });
}
