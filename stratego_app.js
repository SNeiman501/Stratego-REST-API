const { json } = require('express');
const { get, trace } = require('./routes/game');
const gamerules = require('./sub-systems/game/gamerules/gameRules');
const {getMatch} = require('./util/fileHandler');
const fileHandler= require('./util/fileHandler');
const {findUnit,invertMap,obscureEnemyUnits}=require('./util/mapOperations');

function updateMap(match,map,playerSlot){//playerSlot==> si es jugador 1 o jugador 2
    if (playerSlot===1){
        for(let x=0;x<match.map.length;x++){
            for (let y=0;y<4;y++){ // llena las casillas de la 0 a la 3
                match.map[x][y]=map[x][y];
            }
        }
    }else{//si es el slot 2
        for(let x=0;x<match.map.length;x++){
            for (let y=6;y<10;y++){ // llena las casillas de la 6 a la 9
                match.map[x][y]=map[x][y];
            }
        }
    }
    // console.log("mapa completo:")
    // console.log(match.map);
    fileHandler.updateMatchFile(match); //actualiza el archivo de la partida
    addLocalMap(match); //updates player screens
}
//mover las rutas a este archivo puede ser una solucion rapida
async function getStartingUnits(matchID,playerKey){
    let match=await getMatch(matchID);
    if (match instanceof Error){
        return (Error.message);
    }else{
        switch (playerKey){
            case match.player1.key:
                return match.player1units;
                break;
            case match.player2.key:
                return match.player2units;
                 break;
            default:
                // console.log(match.player1.key+"or"+match.player2.key+"!=="+playerKey);
                return ("error: key de jugador erronea");
        };
    }
    }
async function setStartingUnits(map,matchID,playerKey){
    match=await fileHandler.getMatch(matchID);
    // console.log(playerKey)
    if (match instanceof Error){
        return (Error.message);
    }else{
        if (match.setupMode){
            let resul;
            switch (playerKey){
                case match.player1.key:
                    let newMap=invertMap(map); //deja el jugador 1 entre [0][0] y [9][3]
                    map=newMap;
                    resul=gamerules.isValidSetup(map,1,playerKey)
                    if(resul.succes){
                        match.player1units=null;
                        if (match.player2units===null){
                            match.setupMode=false;
                        }
                        updateMap(match,map,1);
                        return  {"succes":true,"mustBeAlerted":false,"message":"no error"}
                    }else{
                        return{"succes":false,"mustBeAlerted":true,"message":resul.message}
                    }
                    break;
                case match.player2.key:
                    resul=gamerules.isValidSetup(map,2,playerKey);
                    if(resul.succes){
                        match.player2units=null;
                        if (match.player1units===null){
                            match.setupMode=false;
                        }
                        updateMap(match,map,2);
                        return {"succes":true,"mustBeAlerted":true,"message":"no error"}
                    }else{
                        return{"succes":false,"mustBeAlerted":true,"message":resul.message}
                    }
                    break;
                default:{ //si ninguna key coincide
                    return{"succes":false,"mustBeAlerted":true,"message":"error==> key del jugador invalida"}
                }
            }
        }else{
            return{"succes":false,"mustBeAlerted":true,"message":"error==> la partida ya no esta en la fase de colocacion de unidades"}
        }
}
}
async function move(unitId,targetPosition,matchID,playerKey){
    let match=await getMatch(matchID);
    console.log("realizando movimiento")
    if (match.currentPlayerTurn===playerKey){
        let unitData=findUnit(match.map,unitId);
        let targetUnit=null;
        if (unitData===false){
            return {"succes":false,"mustBeAlerted":true,"message":"la unidad que se intento mover no existe"}
        }
        console.log("se encontro la unidad")
        let thisMove=gamerules.isValidMovement(match,unitData,targetPosition,playerKey);
        console.log(thisMove)
        if (thisMove.succes){
            let figthResolution;
            let winner;
            console.log("el movimiento esta bien")
            if (match.map[targetPosition.x][targetPosition.y]!==null){
                targetUnit=match.map[targetPosition.x][targetPosition.y];
                //si el objetivo no es null verifica si la unidad es aliada
                if (playerKey===match.map[targetPosition.x][targetPosition.y].owner){
                    return {"succes":false,"mustBeAlerted":true,"message":"atacar unidades aliadas es un acto de traición"}
                }
                //hace los calculos de la pelea con aterioridad
                console.log("el tipo de el enemigo es="+targetUnit.type)
                figthResolution=gamerules.fight(unitData.unit.type,targetUnit.type);
                console.log("figthResolution");
                console.log(figthResolution)
                winner=figthResolution.result;
                console.log(`ataco ${unitData.unit.type} a ${targetUnit.type} gano= ${winner}`)
                switch(winner){
                    case 'gana el atacante':
                        match.map[targetPosition.x][targetPosition.y]=unitData.unit;
                        break;
                    case 'gana el defensor':
                        break;
                    case 'los 2 mueren':
                        match.map[targetPosition.x][targetPosition.y]=null;
                        break;
                    default:
                        return {"succes":false,"mustBeAlerted":true,"message":`problema determinando el resultado del combate entre unidades 
                        ${unitData.unit}(${unitData.pos.x,unitData.pos.y}) y ${targetUnit} (${targetPosition.x,targetPosition.y}) `}
            }
            }else{
                //en caso de que sea null
                console.log("figth resolution")
                figthResolution=gamerules.fight(unitData.unit.type,null);
                match.map[targetPosition.x][targetPosition.y]=unitData.unit;
            }
            //siempre borra la unidad por que se destruye o se mueve
            match.map[unitData.pos.x][unitData.pos.y]=null;

            //si llega a este punto es por que el movimiento era valido
            
            //le pasa el turno al siguiente jugador
            if (match.player1.key===match.currentPlayerTurn){
                match.currentPlayerTurn=match.player2.key;
            }else{
                match.currentPlayerTurn=match.player1.key
            }
            //verifica si gano la partida con el movimiento
            if (targetUnit!=null){
                if (targetUnit.type===0){
                    //hay que hacer un sistema para que se le envie al adversario que perdio
                    //se podria hacer com un endpoint pero va a ser mas facil hacerlo con el socketIO
                    fileHandler.deleteMatch(matchID);
                    return{"succes":true,"mustBeAlerted":true,"message":"ganaste la partida!"}
                }
            }
            fileHandler.updateMatchFile(match); //actualiza los archivos de la partida
            addLocalMap(match); //actualiza la pantalla de los jugadores
            console.log(figthResolution)
            //ignora las alertas de las casillas vacias
            if (figthResolution.reason!=="se avanzo a una casilla vacía"){
                return {"succes":true,"mustBeAlerted":true,"message":(figthResolution.reason+" resultado ==>"+figthResolution.result)}
            }else{
                return {"succes":true,"mustBeAlerted":false,"message":(figthResolution.reason+" resultado ==>"+figthResolution.result)}
            }
        }else{
            return {"succes":false,"mustBeAlerted":true,"message":thisMove.errorMessage}
        }
    }else{
        return {"succes":false,"mustBeAlerted":true,"message":"error, no es tu turno"}
    }
}
function addLocalMap(match){

    if (mapLocalToPlayer.filter(el=>el.playerKey===match.player1.key).length>0){ //si la partida ya existe la acutaliza
        let index1 = mapLocalToPlayer.findIndex(element => {
            if (element.playerKey === match.player1.key) {
              return true;
            }
          
            return false;
          });
          let index2 = mapLocalToPlayer.findIndex(element => {
            if (element.playerKey === match.player2.key) {
              return true;
            }
          
            return false;
          });
        let mapString=JSON.stringify(match.map);
        let mapP1=obscureEnemyUnits(JSON.parse(mapString),match.player1.key);
        mapLocalToPlayer[index1].map=mapP1;
        let mapP2=obscureEnemyUnits(JSON.parse(mapString),match.player2.key);
        mapLocalToPlayer[index2].map=mapP2;
    }else{ //sino, la inicializa
        if (!match.setupMode){ //si no esta en el modo seteo (es decir, estan los 2 jugadores listos)
            let mapString=JSON.stringify(match.map);
            mapCopy=JSON.parse(mapString);
            mapCopy2=JSON.parse(mapString);
            let mapP1=obscureEnemyUnits(mapCopy,match.player1.key);
            mapP1=JSON.stringify(mapP1); //se hace esto para hacer una copia
            let aux=  {
                "playerSlot":1,
                "playerKey":match.player1.key,
                "map":JSON.parse(mapP1)
            }
            mapLocalToPlayer.push(aux)
            let mapP2=obscureEnemyUnits(mapCopy2,match.player2.key);
            mapP2=JSON.stringify(mapP2)
            aux2=  {
                "playerSlot":2,
                "playerKey":match.player2.key,
                "map":JSON.parse(mapP2)
            }
            mapLocalToPlayer.push(aux2)
        }
    }
}
async function initialize(){
    let metaData=await fileHandler.getMetaData();
    let activeMatches=metaData.activeMatches;
    for (let i=0;i<activeMatches.length;i++){
        let match=await fileHandler.getMatch(activeMatches[i]) //i !== numero de partida i es el lugar en el array de partidas
        addLocalMap(match);
    }
    // console.log("inicializacion finalizada");
}
function showPlayerScreens(){setTimeout(function(){
    console.log("pantallas actuales:"+mapLocalToPlayer.length)
    for (let i=0;i<mapLocalToPlayer.length;i++){
        console.log(mapLocalToPlayer[i].playerKey+"-------------------------")
        console.log(mapLocalToPlayer[i].map);
    }
    showPlayerScreens();
}, 15000);}
//codigo de inicializacion
let mapLocalToPlayer=[]; //donde se guarda lo que cada jugador deberia ver
initialize()//.then(showPlayerScreens());


module.exports={
    getStartingUnits,setStartingUnits,move,addLocalMap,mapLocalToPlayer
}