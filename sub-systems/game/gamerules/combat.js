
/*unit type references
0:flag
1:spy
2:scout
3:miner
4-10:common units with no especial rules
11:bomb
*/
function fight(attacker,defender){
    //this function recives 2 unit types (integers)
    if(defender===null){
        return {"result":'attacker won',"reason":`se avanzo a una casilla vacía`}
    }
    if (attacker===defender){
        return {"result":'both units are destroyed',"reason":`a unit (${attacker}) attaked a (${defender}), units are equal`}
    }
    //bomb exeption
    if(defender===11){
        if (attacker===3){
            return {"result":'attacker won',"reason":`a unit ${attacker} attaked(miner) a (${defender})(mine), the miner disarms the bomb`}
        }else return {"result":'defender won',"reason":`a unit ${attacker} attaked a (${defender}), the unit stepped on a mine`}
    }
    //spy exception
    if (attacker===1){
        return {"result":'attacker won',"reason":`a unit ${attacker} attaked a ${defender} spys always win when they attack, unless they step on a bomb`}
    }
    //general criteria
    if (attacker>defender){
        return {"result":'attacker won',"reason":`a unit ${attacker} attaked a ${defender}`}
    }else{
        return {"result":'defender won',"reason":`a unit ${attacker} attaked a ${defender}`}
    }
}
//testing tool
function checkCombatRules(){
    for (let attacker=1;attacker<11;attacker++){
        console.log(`attacker: {${attacker}}`);
        for (let defender=0;defender<12;defender++){
            console.log(`defender:${defender} ====>won:${fight(attacker,defender).reason}`)
        }
        console.log();
        console.log("-------");
        console.log()
    }
}
//checkCombatRules();
module.exports={fight}