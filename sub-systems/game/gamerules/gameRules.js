/*
notas:
falta testear
falta hacer error handling
*/
const startingUnits=require('../startingUnits.json');
const {isValidMovement}=require("./movement");
const {fight}=require('./combat');


function isValidMove(match,unitId,targetPosition,playerKey){
}

function isValidSetup(map,playerSlot,playerKey){
    //playerSlot==>si es jugador 1 o 2
    //contar que la cantidad de unidades del jugador sea la correcta
    var unitCounter=[
        {"type":0,"cantidad":0}, 
        {"type":1,"cantidad":0},
        {"type":2,"cantidad":0},
        {"type":3,"cantidad":0},
        {"type":4,"cantidad":0},
        {"type":5,"cantidad":0},
        {"type":6,"cantidad":0},
        {"type":7,"cantidad":0},
        {"type":8,"cantidad":0},
        {"type":9,"cantidad":0},
        {"type":10,"cantidad":0},
        {"type":11,"cantidad":0}
    ];
    for (let x=0;x<10;x++){
        for (let y=0;y<10;y++){
          //  console.log(`casilla[${x}][${y}] contiene:${map[x][y]} `)
        }
    }
    if (playerSlot===1){
        let writtenInValidTerritory=true;
        //chequea si el territorio es valido
        for(let x=0;x<map.length;x++){
            for (let y=4;y<map[x].length;y++){
                if (map[x][y]!==null){
                    //console.log(`mal: casilla[${x}][${y}] contiene:${map[x][y].type} `)
                    writtenInValidTerritory=false;
                    return {"succes":false,"message":"se trato de colocar unidades en una zona invalida"};
                }
            }
        }
        if (writtenInValidTerritory===true){
            //carga las unidades en un objeto
            for(let x=0;x<map.length;x++){
                for (let y=0;y<4;y++){
                    if (playerKey===map[x][y].owner){ //verifica si las unidades son del jugador
                        let unitType=map[x][y].type;
                        unitCounter[unitType].cantidad=unitCounter[unitType].cantidad+1;
                    }else{
                        //console.log(map[x][y]);
                        return {"succes":false,"message":"se intento colocar unidades que no son del usuario"};
                    }
                }
            }
            //las comprara con el json
            if (JSON.stringify(unitCounter)===JSON.stringify(startingUnits)){ //no se si esta comnparacion funcionara
                return {"succes":true,"message":"jugada valida"};
            }
        }else{
            return {"succes":false,"message":"la cantidad de unidades colocadas es incorrecta"};
        }
    }
    if (playerSlot===2){
        let writtenInValidTerritory=true;
        //chequea si el territorio es valido
        for(let x=0;x<map.length;x++){
            for (let y=0;y<6;y++){
                if (map[x][y]!==null){
                    //console.log(`mal: casilla[${x}][${y}] contiene:${map[x][y].type} `)
                    writtenInValidTerritory=false;
                    return {"succes":false,"message":"se trato de colocar unidades en una zona invalida"};
                }
            }
        }
        if (writtenInValidTerritory===true){
            //carga las unidades en un objeto
            for(let x=0;x<map.length;x++){
                for (let y=6;y<map[x].length;y++){
                    let unitType=map[x][y].type;
                    unitCounter[unitType].cantidad=unitCounter[unitType].cantidad+1;
                }
            }
            //las comprara con el json
            if (JSON.stringify(unitCounter)===JSON.stringify(startingUnits)){
                return {"succes":true,"message":"jugada valida"};
            }
        }else{return {"succes":false,"message":"la cantidad de unidades colocadas es incorrecta"};}
    }
    //si no retorna verdadero anteriormente
    return {"succes":false,"message":"default exit"};
}
module.exports={isValidMove,isValidSetup,fight,isValidMovement};