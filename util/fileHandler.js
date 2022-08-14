/*
takes care of writing and reading files from permanent storage, to ensure a match can be recovered uppon server reset
probably not the most common practice in video games but it was one of the requirements of the original project
*/
const matchRoute= './matches';
const fs = require('fs');
function createMatchFile(match){
    let matchString=JSON.stringify(match);
    fs.writeFile(matchRoute+'/match_'+match.id+".json",matchString,{flag:'w'},err=>{
    if (err){
        console.log("partida:"+match.id +" =>error de lectura: "+err.message)
    }else{
        addMetaData(match.id,match.player1.key,match.player2.key);
    }});
}
function updateMatchFile(match){
    let matchString=JSON.stringify(match);
    fs.writeFile(matchRoute+'/match_'+match.id+".json",matchString,{flag:'w'},err=>{
    if (err){
        console.log("partida:"+match.id +" =>error de lectura: "+err.message)
    }
    });
}
async function getMatch(id){
    try{
        let res = fs.readFileSync(matchRoute+`/match_${id}.json`, 'utf8');
        return JSON.parse(res);
    }catch(err){
        return err;
    }
    }
async function deleteMatch(id){
    getMatch(id).then(match=>{
        deleteMetaData(match.id,match.player1.key,match.player2.key);
        fs.unlink(matchRoute+'/match_'+id+".json",err=>{
        if (err){
            console.log("partida:"+id +" =>error de borrado: "+err.message)
        }});
    });
}
async function getMetaData(){
    let data=fs.readFileSync(matchRoute+'/metaData.json','utf-8');
        return JSON.parse(data);
    }
function addMetaData(id,key1,key2){
    getMetaData().then(metaData=>{
        metaData.activeMatches.push(id);
        metaData.activeKeys.push(key1,key2);
        fs.writeFile(matchRoute+'/metaData.json',JSON.stringify(metaData),{flag:'w'},(err)=>{
        if (err){
            console.log("matchData.json =>error de lectura: "+err.message);
        }});
    })
}
function deleteMetaData(id,key1,key2){
    console.log("deleting:"+key2)
    getMetaData().then(metaData=>{
        let aux=metaData.activeMatches.filter(element=>(element!==id)); //borra la id
        metaData.activeMatches=aux;
        let aux2=metaData.activeKeys.filter(element=>(element!==key1)&&(element!==key2)); //borra las keys
        metaData.activeKeys=aux2;
        fs.writeFile(matchRoute+'/metaData.json',JSON.stringify(metaData),{flag:'w'},(err)=>{
        if (err){
            console.log("matchData.json =>error de lectura: "+err.message);
        }});
    })
}
function updateMatchCounter(value){
    fs.writeFile(matchRoute+'/matchCounter.json',JSON.stringify({"count":value}),{flag:'w'},(err)=>{
        if (err){
            console.log("matchCounter.json =>error al actualizar: "+err.message);
        }});
}
async function getMatchCounter(){
    let data=fs.readFileSync(matchRoute+'/matchCounter.json','utf-8');
        return JSON.parse(data).count;
}
async function isKeyInFile(posibleKey){
    let aux=await getMetaData();
    let keys= aux.activeKeys;
    if (keys.filter((e)=>e===posibleKey).length>0){ //searches for key repetitions
        //if found, it generates a new one
        return true;
    }else{
        return false;
    }
}
//for debuggin, not working currently
async function nukeData(){
    let ids;
    getMetaData().then(async data=>{
        ids=data.activeMatches;
        for (let i=0;i<ids.length;i++){
            await deleteMatch(i+1);
        }
    });
}

module.exports={
    createMatchFile, deleteMatch, getMatch, 
    isKeyInFile, updateMatchFile,updateMatchCounter,
    getMatchCounter,getMetaData
}