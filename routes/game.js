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
    let unitId= JSON.parse(req.body.id); //id de la unidad que se quiere mover
    let pos= JSON.parse(req.body.pos);//pos es un objeto => {"x":posicion_x,"y":_posicion_y} posicion a la que se quiere mover
    let matchID=  req.body.matchID; //id de la partida del localStorage
    let playerKey=  req.body.playerKey;//key del jugador del local storage
    console.log({unitId});
    console.log({pos});
    console.log({matchID});
    console.log({playerKey});
    console.log("respuesta:")
    let respuesta=await game.move(unitId,pos,matchID,playerKey);
    console.log("respuesta del server:")
    console.log(respuesta)
    res.send(respuesta);
});

router.post('/setupData',async (req,res)=>{ //desde el cliente se saca la data de aca
    let matchID=req.body.matchID; //hay que mandar estos parametros en el body
    let playerKey=req.body.playerKey;
    res.send(await game.getStartingUnits(matchID,playerKey));
});

//el siguiente metodo no esta testeado
router.put('/setupData',async (req,res)=>{ //desde el cliente se postea las posiciones desde aca
    let matchID=req.body.matchID; //hay que mandar estos parametros en el body
    let playerKey=req.body.playerKey;
    let map=JSON.parse(req.body.map); //solo de las unidades puestas por el usuario;
    console.log("partida"+matchID);
    console.log("jugador:"+playerKey);
    console.log(map);
    res.send(await game.setStartingUnits(map,matchID,playerKey));
})


module.exports= router;
