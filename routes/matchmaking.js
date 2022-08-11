/*
this routes are meant to be used for matchmaking
*/
const express = require("express");
const router = express.Router();
const {generateUniqueKey}=require('../util/keyGenerator');
const {logInPlayer,getplayersLookingForOponent} = require('../sub-systems/matchmaking_system');


router.get('/searching for oponent...', (req, res) => {
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
    let playerKey=req.body.playerKey;
    let playersLookingForOponent=getplayersLookingForOponent();
    if ((playersLookingForOponent.filter(elem=>{return elem===playerKey})).length>0){
        res.send ({"ended":false});
    }else{
        res.send({"ended":true}); 
    }
})
module.exports= router;