// const cors = require('cors');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*', methods: '*' } });

require('./routes/Socket')(io);

server.listen(process.env.PORT || 4000);
