const que= require('../sub-systems/matchmaking_system');
const {isKeyInFile}=require('./fileHandler');
async function generateUniqueKey(){ //funcion recursiva, genera ids hasta que se genere una no repetida
    function makeid(length) { 
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }
    var posibleKey=makeid(5);
    let repeatedKey = await isKeyInFile(posibleKey);
    if (repeatedKey){ 
        //si encuentra repeticiones genera otra
        return generateUniqueKey();
    }else{
        //si no encuentra repeticiones envia la generada
        return posibleKey;
    }
}
module.exports={
    generateUniqueKey
}