const { json } = require('express');
const { get, trace } = require('./routes/game');
const gamerules = require('./sub-systems/game/gamerules/gameRules');
const {getMatch} = require('./util/fileHandler');
const fileHandler= require('./util/fileHandler');
const {findUnit,invertMap,obscureEnemyUnits}=require('./util/mapOperations');

function updateMap(match,map,playerSlot){//playerSlot==> if the player is 1 or 2
    if (playerSlot===1){
        for(let x=0;x<match.map.length;x++){
            for (let y=0;y<4;y++){ // fills tiles between 0 and 3
                match.map[x][y]=map[x][y];
            }
        }
    }else{//si es el slot 2
        for(let x=0;x<match.map.length;x++){
            for (let y=6;y<10;y++){ // fills tiles between 6 and 9
                match.map[x][y]=map[x][y];
            }
        }
    }
    // console.log("mapa completo:")
    // console.log(match.map);
    fileHandler.updateMatchFile(match); //updates player files
    addLocalMap(match); //updates player screens
}
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
    if (match instanceof Error){
        return (Error.message);
    }else{
        if (match.setupMode){
            let resul;
            switch (playerKey){
                case match.player1.key:
                    let newMap=invertMap(map); //puts player 1 between [0][0] and [9][3]
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
                default:{ //if no key matches
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
                //if the target is not null it checks if the unit is an ally
                if (playerKey===match.map[targetPosition.x][targetPosition.y].owner){
                    return {"succes":false,"mustBeAlerted":true,"message":"atacking ally units is considered to be an act of treason"}
                }
                //creates the results of the fight in advance
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
                //in case of null
                console.log("figth resolution")
                figthResolution=gamerules.fight(unitData.unit.type,null);
                match.map[targetPosition.x][targetPosition.y]=unitData.unit;
            }
            //it always deletes the unit form the place it moved from, because it either moves or dies
            match.map[unitData.pos.x][unitData.pos.y]=null;

            //if this point is reached, it is because the movement is valid
            
            //so it passes the turn to the opponent
            if (match.player1.key===match.currentPlayerTurn){
                match.currentPlayerTurn=match.player2.key;
            }else{
                match.currentPlayerTurn=match.player1.key
            }
            //it checks if the movement caused the player to win
            if (targetUnit!=null){
                if (targetUnit.type===0){
                    //here must be implemented some sort of system wich tells the users the result of the match
                    fileHandler.deleteMatch(matchID);
                    return{"succes":true,"mustBeAlerted":true,"message":"ganaste la partida!"}
                }
            }
            fileHandler.updateMatchFile(match); //updates players files
            addLocalMap(match); //updates player screens
            console.log(figthResolution)
            //ignores the alerts from void tiles
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
    //if a match exists, it updates it
    if (mapLocalToPlayer.filter(el=>el.playerKey===match.player1.key).length>0){ 
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
    }
    //if it does not exist, it is initialized
    else{ 
        if (!match.setupMode){ //if the two players are ready (they both put their units)
            let mapString=JSON.stringify(match.map);
            mapCopy=JSON.parse(mapString);
            mapCopy2=JSON.parse(mapString);
            let mapP1=obscureEnemyUnits(mapCopy,match.player1.key);
            mapP1=JSON.stringify(mapP1); //this is done to make a copy
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
        let match=await fileHandler.getMatch(activeMatches[i])
        addLocalMap(match);
    }
}

//used for debugging, 
function showPlayerScreens(){setTimeout(function(){
    console.log("pantallas actuales:"+mapLocalToPlayer.length)
    for (let i=0;i<mapLocalToPlayer.length;i++){
        console.log(mapLocalToPlayer[i].playerKey+"-------------------------")
        console.log(mapLocalToPlayer[i].map);
    }
    showPlayerScreens();
}, 15000);}
function getPlayerBoard(key){
    return mapLocalToPlayer.find(element=> element.playerKey===key);
}
//initialization code
let mapLocalToPlayer=[]; //this variable stores what each player sees
initialize()//.then(showPlayerScreens());


module.exports={
    getStartingUnits,setStartingUnits,move,addLocalMap,mapLocalToPlayer,getPlayerBoard
}