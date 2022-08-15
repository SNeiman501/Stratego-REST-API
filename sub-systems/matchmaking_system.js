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
function createNewQueue(syncronization_phrase){
    let newQueue=new Queue(syncronization_phrase,matchCounter);
    matchCounter++;
    fileHandler.updateMatchCounter(matchCounter);
    return newQueue;
}
function logInPlayer(name,key,syncronization_phrase){
    var p=new Player(name,key);
    playersLookingForOpponent.push(key)
    let queueWithPhrase=playerQueueList.filter(element=>{return element.syncronization_phrase===syncronization_phrase})
    let target_queue;
    if (queueWithPhrase.length>0){
        queueWithPhrase[0].enqueue(p)
        target_queue={...queueWithPhrase}[0]; //creates a clone of the object
    }else{
        //if no queues exist with that phrase it creates one
        let newQueue=createNewQueue(syncronization_phrase)
        newQueue.enqueue(p);
        playerQueueList.push(newQueue);
        target_queue=newQueue;
    }
    onNewPLayer(target_queue);
    // console.log("player logged in:")
    // console.log(p);
    return (target_queue.matchID)
}

function onNewPLayer(target_queue){
    console.log(target_queue)
    console.log(target_queue.size())
    if (target_queue.size()>=2){
        let p1= target_queue.dequeue();
        let p2= target_queue.dequeue();
        let m = new Match(p1,p2,target_queue.matchID);
        let playerUnits=createUnits(p1.key,p2.key);
        m.player1units=playerUnits.p1;
        m.player2units=playerUnits.p2;
        fileHandler.createMatchFile(m);
        //adds the local maps associated to the match
        addLocalMap(m);
        //deletes the queue from the list
        playerQueueList=playerQueueList.filter(element=>{return element.syncronization_phrase!==target_queue.syncronization_phrase})
        //deletes the keys from the list of players looking for matches
        playersLookingForOpponent=playersLookingForOpponent.filter(element=>{return ((element!==p1.key)&&(element!==p2.key))})
        // console.log("queue:")
        // console.log(playersLookingForOpponent);
    }
}

async function initialize(){
    matchCounter=await fileHandler.getMatchCounter();
}
function getplayersLookingForOpponent(){
    return playersLookingForOpponent;
}
//initialization code
var spaceForPlayer=false;
//all queues are stored here, one for each user syncronization phrase
var playerQueueList=[]; 
//stores the keys of players currently looking for a match
var playersLookingForOpponent=[];
 initialize();
module.exports={
    logInPlayer,
    getplayersLookingForOpponent
}