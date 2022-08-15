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
// custom Queue class that stores an aditional value (sync phrase) and to store the asociated match key 
class Queue {
    syncronization_phrase; //used to join players who whant to play together
    matchID; //ID that would be assigned to the match in case it is created
    constructor(syncronization_phrase,matchID) {
        this.syncronization_phrase=syncronization_phrase;
        this.matchID=matchID;
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
    player1units;
    player2;
    player2units;
    ended;
    //this holds the key, not te slot
    currentPlayerTurn;
    //true if both players havent set their units
    setupMode;
    id;
    //10 by 10 grid
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
1:espy
2:scout
3:miner
4-10:regular units
11:bomb
12:unknown unit
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
module.exports={
    Match,
    Queue,
    Player,
    Unit
}
