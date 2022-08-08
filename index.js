const express = require('express');
const PORT = 3000;
const app = express();

const menuRoute= require('./routes/menu');
const gameRoute= require('./routes/game');
const matchMakingRoute = require('./routes/matchmaking');
const game=require('./stratego_app');

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use('/menu',menuRoute);
app.use('/matchmaking',matchMakingRoute);
app.use('/game',gameRoute);

app.get('/',(req,res)=>{
    res.sendFile('views/instructions.html',{root:'./public'});
})

//_____________________________________
const http = require('http');
const socketio = require('socket.io');      //contiene la parte del cliente y del servidor
const server = http.createServer(app);     
const io = socketio(server);

const Lobby = require ('./routes/lobby'),
    lobby = new Lobby(io, game.mapLocalToPlayer);
	

server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));