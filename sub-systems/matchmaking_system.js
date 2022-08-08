const router = require('../routes/matchmaking');
const {Player,Match, Queue } = require("../util/classes");
const fileHandler=require("../util/fileHandler");
const {createUnits}=require('./game/unitFactory');
const {addLocalMap}=require('../stratego_app');
var matchCounter=0; //desde el ultimo reset

/*
desde que se implemento poder logearse con una frase de syncronizacion se introdujo la posibilidad de generar
choques entre las partidas (que se le asigne la misma id que a otra), lo voy a solucionar mas adelante
tiene que ver con que el programa predice que numero de partida se le va a asignar a un jugador sin creear la partida
eso lleva a que si se crea una partida mientras el jugador sigue esperando a su oponente, la prediccion va a ser incorrecta

-santiago
*/

// controlador ---deberiamos ponerlo en un archivo dedicado eventualmente
function logInPlayer(name,key,syncronization_phrase){
    var p=new Player(name,key);
    playersLookingForOponent.push(key);//avisa que esta buscando partida
    // console.log("cola:")
    // console.log(playersLookingForOponent);
    let queueWithPhrase=playerQueueList.filter(element=>{return element.syncronization_phrase===syncronization_phrase}) //busca queue que corresponde
    // console.log("colas con esa frase:");
    // console.log(queueWithPhrase);
    if (queueWithPhrase.length>0){
        //en caso de que ya exista alguien con esa frase esperando a encontrar partida
        queueWithPhrase[0].enqueue(p)
    }else{
        //si no hay nadie esperando encontrar partida con esa frase, crea una queue con esa frase
        let newQueue=new Queue(syncronization_phrase);
        newQueue.enqueue(p);
        playerQueueList.push(newQueue);
    }
    // console.log("se logeo un jugador:")
    // console.log(p);
    let target_queue=playerQueueList.find(element=>{return element.syncronization_phrase===syncronization_phrase}); //en caso de que se generara una nueva cola
    return onNewPLayer(target_queue); //devuelve la id que va a tener la siguiente partida
}

function onNewPLayer(target_queue){ //crea partidas con la cola a la que apunta
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
        addLocalMap(m); //agrega los local maps correspondientes a la partida
        fileHandler.updateMatchCounter(matchCounter);
        //la siguiente linea elimina la queue de la lista de queues
        playerQueueList=playerQueueList.filter(element=>{return element.syncronization_phrase!==target_queue.syncronization_phrase})
        //la siguiente linea elimina las keys de los jugadores que encontraron partida
        playersLookingForOponent=playersLookingForOponent.filter(element=>{return ((element!==p1.key)&&(element!==p2.key))})
        // console.log("cola:")
        // console.log(playersLookingForOponent);
        return matchCounter; //devuelve la id de la partida que se creo
}else{
    return(matchCounter+1); //devuelve la id que va a tener la siguiente partida (donde se va a cargar el siguiente jugador)
}
}

async function initialize(){
    matchCounter=await fileHandler.getMatchCounter();
}
function getplayersLookingForOponent(){
    return playersLookingForOponent;
}
//codigo principal
var spaceForPlayer=false;
var playerQueueList=[]; //toda las queues se guardan aca, se genera una por cada clave de usuario
var playersLookingForOponent=[]; //almacena las keys de los jugadores que buscan partidas
 initialize();
module.exports={
    logInPlayer,
    getplayersLookingForOponent
}