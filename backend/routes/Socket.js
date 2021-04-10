
module.exports = io => {
    let rooms = [];

    io.on('connection', socket => {
        socket.emit('updateRooms', rooms);

        socket.on('createRoom', options => {
            rooms.push({ ...options, id: socket.id });
            socket.join(socket.id);
            socket.broadcast.emit('updateRooms', rooms);
        })

        socket.on('joinRoom', roomId => {
            socket.join(roomId);
            rooms = rooms.filter(room => room.id !== roomId);
            io.emit('updateRooms', rooms);
        })
    });
}
