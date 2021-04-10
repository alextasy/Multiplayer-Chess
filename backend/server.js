const cors = require('cors');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*', methods: '*' } });

require('./routes/Socket')(io);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); // Take care of cors issues
app.use('/', require('./routes/Auth').router);

server.listen(process.env.PORT || 4000);
