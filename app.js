const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const config = require('./config');

var secretkey = config.SECRET_KEY;

const port = process.env.PORT || 8888;
const index = require('./routes/index');

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);


let interval;

io.on('connection', socket => {
    console.log('New client');
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 10000);
    socket.on('disconnect', () => {
        console.log('client disconnected.')
    })
})

const getApiAndEmit = async socket => {
    try {
        const res = await axios.get('https://api.darksky.net/forecast/'+secretkey+'/17.3850,78.4867');
        socket.emit('FromAPI', res.data.currently.temprature);
    } catch (error) {
        console.log(`Error: ${error.code}`);
    }
}

server.listen(port, () => console.log(`Listening on Port: ${port}`))