function findUnit(map,id){
    for (let i=0;i<map.length;i++){
        for (let j=0;j<map.length;j++){
            if (map[i][j]!=null){
                if (map[i][j].id===id){
                    return {"unit":map[i][j],"pos":{"x":i,"y":j}}
                }
            }
        }
    }
    return(false);
}
function invertMap(map){
    //solo confirmo que funciona para matrices cuadradas

    var newMap=[];
    //inicializo el mapa nuevo
    for (let i=0;i<10;i++){
        newMap[i]=[];
        for (let j=0;j<10;j++){
            newMap[i][j]=null;
        }
    }

    for (let x=0;x<10;x++){
        for (let y=0;y<10;y++){
            newMap[x][9-y]=map[x][y];
        }
    }
    return newMap;
}
function obscureEnemyUnits(map,playerKey){
    let obscuredMap=[];
    for (let x=0;x<10;x++){
        obscuredMap[x]=[];
        for (let y=0;y<map[x].length;y++){
            if (map[x][y]==null){
                obscuredMap[x][y]=map[x][y];
            }else{
                if (map[x][y].owner!==playerKey){ 
                    obscuredMap[x][y]=map[x][y]
                    obscuredMap[x][y].type=12 //type === 12 es desconocido (unidad enemiga)
                }else{
                    obscuredMap[x][y]=map[x][y] //prseserva las unidades del jugador
                }
            }
        }
    }
    return obscuredMap;
}
module.exports={
    findUnit,invertMap,obscureEnemyUnits
}