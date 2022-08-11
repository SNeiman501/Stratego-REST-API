/*
this routes are meant to be used for interacting with the game grid, the actual instance of the game
*/
const { application, json } = require("express");
const express=require("express");
const router = express.Router();
const game=require('../stratego_app');
router.use(express.json())
router.get('/', (req, res) => {
    res.sendFile('./views/game.html',{root: './public'});
});

router.put('/sendPlay/',async (req,res)=>{
    console.log(req.body);
    let unitId= JSON.parse(req.body.id); //id of the unit that is being moved
    let pos= JSON.parse(req.body.pos);//target position of the movement  => {"x":position_x,"y":_position_y}
    let matchID=  req.body.matchID;//from local storage
    let playerKey=  req.body.playerKey;//from local storage
    let respuesta=await game.move(unitId,pos,matchID,playerKey);
    res.send(respuesta);
});

router.post('/setupData',async (req,res)=>{
    //sends the units that the player can put int the grid

    //this works as a get, but it does not support req.body content, so it is implemented with a post
    //should find a way to us it with the right http verb eventually
    let matchID=req.body.matchID; //hay que mandar estos parametros en el body
    let playerKey=req.body.playerKey;
    res.send(await game.getStartingUnits(matchID,playerKey));
});

router.put('/setupData',async (req,res)=>{
    //updates the match with the placement of the units of a certain player
    let matchID=req.body.matchID;
    let playerKey=req.body.playerKey;
    let map=JSON.parse(req.body.map);
    console.log("partida"+matchID);
    console.log("jugador:"+playerKey);
    console.log(map);
    res.send(await game.setStartingUnits(map,matchID,playerKey));
})

router.get('/getBoardState',(req,res)=>{
    //sends the current state of the board to the client
    let playerKey=req.body.playerKey;
    res.send(game.getPlayerBoard(playerKey));
})


module.exports= router;
