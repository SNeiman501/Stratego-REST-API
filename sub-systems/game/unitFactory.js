//must reed the ammounts of each type of unit and generate 2 arrays with 40 units each
//unit ids must be unique
const startingUnits= require('./startingUnits.json');
const {Unit}= require('../../util/classes.js');
var keyList=[];

//recursive function to ensure the generation is unique
function generateUniqueID(){
    function makeid(length) { 
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }
    var posibleKey=makeid(2); //with 2 digits recursion chance is low enough

    if (keyList.filter((e)=>e===posibleKey).length>0){ 
        //if a repetition is found, it generates a new one
        return generateUniqueID();
    }else{
        return posibleKey;
    }
}
function createUnits(player1Key,player2Key){
    let p1=[];
    let p2=[];
    for (let i=0;i<startingUnits.length;i++){
        let actualType= startingUnits[i];
        for (let j=0;j<startingUnits[i].cantidad;j++){
            let id1=generateUniqueID();
            p1.push(new Unit(id1,startingUnits[i].type,player1Key));
            keyList.push(id1);
            let id2=generateUniqueID();
            p2.push(new Unit(id2,startingUnits[i].type,player2Key));
            keyList.push(id2);
        }
    }
    //resets key list so it wont affect other matches
    keyList=[]; 
    return {"p1":p1,"p2":p2}
}
module.exports={createUnits}