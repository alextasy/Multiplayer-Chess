
module.exports = io => {
    const rooms = [];

    io.on('connection', socket => {
        socket.emit('updateRooms', rooms);

        socket.on('createRoom', options => {
            rooms.push({ ...options, id: socket.id });
            socket.join(socket.id);
            socket.broadcast.emit('updateRooms', rooms);
        })
    });
}
