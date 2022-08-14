/*
this file imports both the combat and the movement rules
olso adds parameters for creating units and methods for checking unit placement
*/
const startingUnits = require("../startingUnits.json");
const { isValidMovement } = require("./movement");
const { fight } = require("./combat");

function isValidSetup(map,playerSlot,playerKey){
    //playerSlot==>1 or 2
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
        }
      }
    if (playerSlot===1){
        let writtenInValidTerritory=true;
        //checks if the units were placed in a valid territory
        for(let x=0;x<map.length;x++){
            for (let y=4;y<map[x].length;y++){
                if (map[x][y]!==null){
                    writtenInValidTerritory=false;
                    return {"succes":false,"message":"se trato de colocar unidades en una zona invalida"};
                }
            }
        }
        if (writtenInValidTerritory===true){
            //it counts the units that were placed and checks if they belong to the player
            for(let x=0;x<map.length;x++){
                for (let y=0;y<4;y++){
                    if (playerKey===map[x][y].owner){
                        let unitType=map[x][y].type;
                        unitCounter[unitType].cantidad=unitCounter[unitType].cantidad+1;
                    }else{
                        return {"succes":false,"message":"attempted to place units wich do not belong to the user"};
                    }
                }
            }
            //it checks if the ammounts of each unit placed are the same as startingUnits.json specifies
            if (JSON.stringify(unitCounter)===JSON.stringify(startingUnits)){ 
                return {"succes":true,"message":"valid placement"};
            }
        }else{
            return {"succes":false,"message":"the ammount of units placed is not correct"};
        }
      }
    if (playerSlot===2){
        let writtenInValidTerritory=true;
         //checks if the units were placed in a valid territory
        for(let x=0;x<map.length;x++){
            for (let y=0;y<6;y++){
                if (map[x][y]!==null){
                    writtenInValidTerritory=false;
                    return {"succes":false,"message":"se trato de colocar unidades en una zona invalida"};
                }
            }
        }
        if (writtenInValidTerritory===true){
             //it counts the units that were placed and checks if they belong to the player
            for(let x=0;x<map.length;x++){
                for (let y=6;y<map[x].length;y++){
                    let unitType=map[x][y].type;
                    unitCounter[unitType].cantidad=unitCounter[unitType].cantidad+1;
                }
            }
             //it checks if the ammounts of each unit placed are the same as startingUnits.json specifies
            if (JSON.stringify(unitCounter)===JSON.stringify(startingUnits)){
                return {"succes":true,"message":"jugada valida"};
            }
        }else{return {"succes":false,"message":"la cantidad de unidades colocadas es incorrecta"};}
    }
    return {"succes":false,"message":"unknown error"};
}
module.exports={isValidSetup,fight,isValidMovement};

