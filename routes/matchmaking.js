//rutas para encontrar partida
const express = require("express");
const router = express.Router();
const {generateUniqueKey}=require('../util/keyGenerator');
const {logInPlayer,getplayersLookingForOponent} = require('../sub-systems/matchmaking_system');

//rutas
router.get('/buscandoOponente...', (req, res) => {
    res.sendFile('./views/matchmaking_screen.html',{root: './public'});
});
router.get('/playerLogIn',(req,res)=>{
    res.sendFile('./views/player_logIn.html',{root: './public'});
})
router.post('/searchForOponent',async (req,res)=>{
    generateUniqueKey().then((key)=>{
        let matchID=logInPlayer(req.body.name,key,req.body.syncronization_phrase);
        res.send({'key':key,'matchID':matchID});
    });
});
router.put('/matchmakingEnded',async (req,res)=>{
    //esta implementacion puede introducir problemas si se accede a las rutas manualmente
    //pero tiene la ventaja de utilizar memoria principal, aumentando el tiempo de respuesta y reduciendo las operaciones de lectura en el servidor
    //la alternativa es buscar en la lista de jugadores activos de metadata.json 
    let playerKey=req.body.playerKey;
    let playersLookingForOponent=getplayersLookingForOponent();
    if ((playersLookingForOponent.filter(elem=>{return elem===playerKey})).length>0){//si encuentra la key en la lista de jugadores que estan buscando partida
        res.send ({"ended":false}); // es decir, sigue buscando partida (esta en la lista de jugadores que buscan partida)
    }else{
        res.send({"ended":true}); // es decir, ya no esta buscando partida (el problema es que puede ser que la key no exista)
        //pero el servidor le va a devolver bad requests
    }
})
module.exports= router;