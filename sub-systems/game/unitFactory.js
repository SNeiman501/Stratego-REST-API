//debe leer las cantidades para cada tipo y generar 2 arrays de 40 unidades (clase unit)
//las ids de las units deben ser unicas
const startingUnits= require('./startingUnits.json');
const {Unit}= require('../../util/classes.js');
var keyList=[];

function generateUniqueID(){ //funcion recursiva, genera ids hasta que se genere una no repetida
    function makeid(length) { 
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }
    var posibleKey=makeid(2); //solo 2 digitos por que la chance de repeticion es lo suficientemente baja

    if (keyList.filter((e)=>e===posibleKey).length>0){ 
        //si encuentra repeticiones genera otra
        return generateUniqueID();
    }else{
        //si no encuentra repeticiones envia la generada
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
    keyList=[]; //resetea la keyList para que no se mezclen entre las partidas
    return {"p1":p1,"p2":p2}
}
module.exports={createUnits}