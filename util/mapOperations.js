const sizeLength=10;
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
    var newMap=[];
    for (let i=0;i<sizeLength;i++){
        newMap[i]=[];
        for (let j=0;j<sizeLength;j++){
            newMap[i][j]=null;
        }
    }

    for (let x=0;x<sizeLength;x++){
        for (let y=0;y<sizeLength;y++){
            newMap[x][9-y]=map[x][y];
        }
    }
    return newMap;
}
function obscureEnemyUnits(map,playerKey){
    let obscuredMap=[];
    for (let x=0;x<sizeLength;x++){
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