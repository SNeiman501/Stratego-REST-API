/*
this method of generating keys is reliable but it can cause slowdowns when scaled
clearly only viable for prototyping
*/
const {isKeyInFile}=require('./fileHandler');
async function generateUniqueKey(){
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
        //if repetition is found it generates a new one
        return generateUniqueKey();
    }else{
        return posibleKey;
    }
}
module.exports={
    generateUniqueKey
}