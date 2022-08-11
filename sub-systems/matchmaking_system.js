const router = require('../routes/matchmaking');
const {Player,Match, Queue } = require("../util/classes");
const fileHandler=require("../util/fileHandler");
const {createUnits}=require('./game/unitFactory');
const {addLocalMap}=require('../stratego_app');
var matchCounter=0;

/*
this file takes care of the matchmaking
for the time being it works by predicting the number of the next match 
this introduces a big problem, I'll add the issue as soon as posible explaing the problem
this is a critical error
*/

function logInPlayer(name,key,syncronization_phrase){
    var p=new Player(name,key);
    playersLookingForOponent.push(key)
    let queueWithPhrase=playerQueueList.filter(element=>{return element.syncronization_phrase===syncronization_phrase}) 
    if (queueWithPhrase.length>0){
        queueWithPhrase[0].enqueue(p)
    }else{
        //if no queues exist with that frase it creates one
        let newQueue=new Queue(syncronization_phrase);
        newQueue.enqueue(p);
        playerQueueList.push(newQueue);
    }
    // console.log("player loged in:")
    // console.log(p);
    let target_queue=playerQueueList.find(element=>{return element.syncronization_phrase===syncronization_phrase}); //en caso de que se generara una nueva cola
    return onNewPLayer(target_queue); //returns the id of the next match
}

function onNewPLayer(target_queue){
    console.log(target_queue)
    if (target_queue.size()>=2){
        let p1= target_queue.dequeue();
        let p2= target_queue.dequeue();
        console.log("creando partida")
        console.log(p1,p2);
        matchCounter++;
        let m = new Match(p1,p2,matchCounter);
        let playerUnits=createUnits(p1.key,p2.key);
        m.player1units=playerUnits.p1;
        m.player2units=playerUnits.p2;
        fileHandler.createMatchFile(m);
        //adds the local maps asociated to the match
        addLocalMap(m);
        fileHandler.updateMatchCounter(matchCounter);
        //delets the queue from the list
        playerQueueList=playerQueueList.filter(element=>{return element.syncronization_phrase!==target_queue.syncronization_phrase})
        //delets the keys from the list of players looking for matches
        playersLookingForOponent=playersLookingForOponent.filter(element=>{return ((element!==p1.key)&&(element!==p2.key))})
        // console.log("queue:")
        // console.log(playersLookingForOponent);
        return matchCounter; //returns the id of the match that was created
}else{
     //in case no match is created returns the id of next match that will be created
    return(matchCounter+1);
}
}

async function initialize(){
    matchCounter=await fileHandler.getMatchCounter();
}
function getplayersLookingForOponent(){
    return playersLookingForOponent;
}
//initialization code
var spaceForPlayer=false;
//all queues are stored here, one for each user syncronization phrase
var playerQueueList=[]; 
//stores the keys of playes currently looking for a match
var playersLookingForOponent=[];
 initialize();
module.exports={
    logInPlayer,
    getplayersLookingForOponent
}