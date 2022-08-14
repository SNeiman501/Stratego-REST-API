/*
this file is used to determin if a unit can move in a certain way
*/

function posToMovement(position, targetPosition) {
    console.log("posToMov")
    console.log({ position })
    console.log({ targetPosition })
    let movement = { "onlyMoved1way": false, "movementDirection": 'no', "movedSpaces": 0, "validPosition": true }
    if ((position.x !== targetPosition.x) && (position.y === targetPosition.y)) {
        //if it moved in x
        movement.onlyMoved1way = true;
        movement.movedSpaces = targetPosition.x - position.x;
        movement.movementDirection = 'x';
    }
    if ((position.y !== targetPosition.y) && (position.x === targetPosition.x)) {
        //if it moved in y
        movement.onlyMoved1way = true;
        movement.movedSpaces = targetPosition.y - position.y;
        movement.movementDirection = 'y';
    }
    if ((targetPosition.x > 9) || (targetPosition.y > 9) || (targetPosition.x < 0) || (targetPosition.y < 0)) {
        movement.validPosition = false;
    }
    return movement;
}
const isValidMovement = (match, unitData, targetPosition, playerKey) => {
    let answer = { "succes": false, "errorMessage": "error desconocido" }
    if (unitData.unit.owner === playerKey) {
        //bombs, flags and lakes cannot move
        if ((unitData.unit.type === 0) || (unitData.unit.type === 11)) {
            answer.errorMessage = "error: bombs and flags cannot be moved";
            answer.succes = false;
            return answer;
        }
        let move = posToMovement(unitData.pos, targetPosition);
        if (move.validPosition) {
            if (move.onlyMoved1way) {
                if ((move.movedSpaces === (1)) || (move.movedSpaces === (-1))) {  //si solo se mueve una casilla
                    answer.errorMessage = "no errors, movement was correct";
                    answer.succes = true;
                    return answer;
                } else {
                    //movement exception for scouts
                    if (unitData.unit.type === 2) {
                        if (move.movementDirection === 'x') {
                            if (move.movedSpaces > 0) {
                                //if movement is positive
                                //checks if units are on the way
                                for (let x = unitData.pos.x + 1; x < targetPosition.x; x++) {
                                    if (match.map[x][unitData.pos.y] != null) {
                                        answer.errorMessage = "error: units are on the way";
                                        answer.succes = false;
                                        return answer;
                                    }
                                    console.log(`([${x}],[${unitData.pos.y}]) no es un obstaculo`)
                                }
                            } else {
                                //if movement is negative
                                //checks if units are on the way
                                for (let x = unitData.pos.x - 1; x > targetPosition.x; x--) {
                                    if (match.map[x][unitData.pos.y] != null) {
                                        answer.errorMessage = "error: units are on the way";
                                        answer.succes = false;
                                        return answer;
                                    }
                                    console.log(`([${x}],[${unitData.pos.y}]) no es un obstaculo`)
                                }
                            }
                        } else {//lo mismo con y
                            if (move.movedSpaces > 0) {
                                //si el movimiento es positivo
                                for (let y = unitData.pos.y + 1; y < targetPosition.y; y++) { //revisa todas las unidades hasta llegar a la posicion
                                    if (match.map[unitData.pos.x][y] != null) {
                                        //console.log(`([${[unitData.pos.x]}],[${y}]) is on the way!`)
                                        answer.errorMessage = "error: units are on the way";
                                        answer.succes = false;
                                        return answer;
                                    }
                                }
                            } else {
                                //si el movimiento es negativo
                                for (let y = unitData.pos.y - 1; y > targetPosition.y; y--) { //revisa todas las unidades hasta llegar a la posicion
                                    if (match.map[unitData.pos.x][y] != null) {
                                        //console.log(`([${[unitData.pos.x]}],[${y}]) is on the way!`)
                                        answer.errorMessage = "error: units are on the way";
                                        answer.succes = false;
                                        return answer;
                                    }
                                }
                            }
                        }
                        answer.errorMessage = "sin errores";
                        answer.succes = true;
                        return answer;
                    } else {
                        answer.errorMessage = (`error: only scouts(2) can move more than 1 tile, the unit in ${unitData.pos.x},${unitData.pos.y} tried to move to ${targetPosition.x},${targetPosition.y}`);
                        answer.succes = false;
                        return answer;
                    }
                }
            } else {
                answer.errorMessage = (`error: units can only move horizontally or vertically, the unit in ${unitData.pos.x},${unitData.pos.y} tried to move to ${targetPosition.x},${targetPosition.y}`);
                answer.succes = false;
                return answer;
            }
        } else {
            answer.errorMessage = (`error: the tile you are trying to move the unit to is outside the map limits,  [${targetPosition.x}][${targetPosition.y}]`);
            answer.succes = false;
            return answer;
        }
    } else {
        answer.errorMessage = (`error: the unit you are trying to move does not belong to you`);
        answer.succes = false;
        return answer;
    }
}
module.exports = {
    isValidMovement,
};
