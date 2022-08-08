class Player{
    name;
    key;
    constructor(name,key){
        this.name=name;
        this.key=key;
    }
    set(name,key){
        this.name=name;
        this.key=key;
    }
}
// program to implement queue data structure

class Queue {
    syncronization_phrase;
    constructor(syncronization_phrase) {
        this.syncronization_phrase=syncronization_phrase;
        this.items = [];
    }
    // add element to the queue
    enqueue(element) {
        return this.items.push(element);
    }
    // remove element from the queue
    dequeue() {
        if(this.items.length > 0) {
            return this.items.shift();
        }
    }
    // view the last element
    peek() {
        return this.items[this.items.length - 1];
    }
    
    // check if the queue is empty
    isEmpty(){
       return this.items.length == 0;
    }
   
    // the size of the queue
    size(){
        return this.items.length;
    }
 
    // empty the queue
    clear(){
        this.items = [];
    }
    toArray(){
        return this.items;
    }
}
const mapHeight=10;
const mapWidth=10;
class Match{
    player1;
    player1units; //tengo que ponerlo aca por uqe no puedo enviar mensajes direccionados a cada cliente
    player2;
    player2units;
    ended; //si la partida termino
    currentPlayerTurn;//usa la key
    setupMode; //cuando hay que poner las fichas
    id;//id de la partida (generadas linealmente: 1,2,3,4) la verficacion se hace desde las keys de los jugadores asi que no importa
    map;
    constructor(p1,p2,id){
        this.ended=false;
        this.player1=p1;
        this.player2=p2;
        this.setupMode=true;
        this.currentPlayerTurn=this.player1.key;
        this.map=[];
        this.id=id;
        for (let i=0;i<mapWidth;i++){
            this.map[i]=[];
            for (let j=0;j<mapHeight;j++){
                this.map[i][j]=null;
            }
        }
    }
}

/*referencia tipo(type) de unidad:
0:bandera
1:espia
2:scout
3:minero
4-10:unidades comunes
11:bomba
12:unidad enemiga (desconocido)
*/

class Unit{
    id;
    type;
    owner;//player key
    constructor(id,type,owner){
        this.id=id;
        this.type=type;
        this.owner=owner;
    } 
}

//se devuelven instancias de las clases, no logre poder usarlas como clases en otros archivos
//el cambio es minimo de todas formas, se tiene que llamar por un constructor vacio y despues usar el set(params)
module.exports={
    Match,
    Queue,
    Player,
    Unit
}
