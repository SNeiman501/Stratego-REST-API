/*esto de deberia organizar, esta bastante dificil de leer
el mantenimiento seria complicado*/

function posToMovement(position, targetPosition) {
  console.log("posToMov");
  console.log({ position });
  console.log({ targetPosition });
  let movement = {
    onlyMoved1way: false,
    movementDirection: "no",
    movedSpaces: 0,
    validPosition: true,
  };
  if (position.x !== targetPosition.x && position.y === targetPosition.y) {
    //si se mueve en x
    movement.onlyMoved1way = true;
    movement.movedSpaces = targetPosition.x - position.x;
    movement.movementDirection = "x";
  }
  if (position.y !== targetPosition.y && position.x === targetPosition.x) {
    //si se mueve en y
    movement.onlyMoved1way = true;
    movement.movedSpaces = targetPosition.y - position.y;
    movement.movementDirection = "y";
  }
  if (
    targetPosition.x > 9 ||
    targetPosition.y > 9 ||
    targetPosition.x < 0 ||
    targetPosition.y < 0
  ) {
    movement.validPosition = false;
  }
  return movement;
}
const isValidMovement = (match, unitData, targetPosition, playerKey) => {
  let answer = { succes: false, errorMessage: "error desconocido" }; //mensaje de error por defect
  if (unitData.unit.owner === playerKey) {
    if (unitData.unit.type === 0 || unitData.unit.type === 11) {
      //si es una bandera o una bomba no se puede mover
      answer.errorMessage =
        "error: ni las bombas ni las banderas pueden ser movidas";
      answer.succes = false;
      return answer;
    }
    let move = posToMovement(unitData.pos, targetPosition);
    console.log("espacios:" + move.movedSpaces);
    console.log("direccion:" + move.movementDirection);
    console.log("se movio en una sola direccion?:" + move.onlyMoved1way);
    if (move.validPosition) {
      if (move.onlyMoved1way) {
        if (move.movedSpaces === 1 || move.movedSpaces === -1) {
          //si solo se mueve una casilla
          answer.errorMessage = "sin errores";
          answer.succes = true;
          return answer;
        } else {
          if (unitData.unit.type === 2) {
            //si es un scout
            console.log("es scout");
            if (move.movementDirection === "x") {
              if (move.movedSpaces > 0) {
                //si el movimiento es positivo
                for (let x = unitData.pos.x + 1; x < targetPosition.x; x++) {
                  //revisa todas las unidades hasta llegar a la posicion
                  if (match.map[x][unitData.pos.y] != null) {
                    answer.errorMessage = "error: hay unidades en el camino";
                    answer.succes = false;
                    return answer;
                  }
                  console.log(
                    `([${x}],[${unitData.pos.y}]) no es un obstaculo`
                  );
                }
              } else {
                //si el movimiento es negativo
                for (let x = unitData.pos.x - 1; x > targetPosition.x; x--) {
                  //revisa todas las unidades hasta llegar a la posicion
                  if (match.map[x][unitData.pos.y] != null) {
                    answer.errorMessage = "error: hay unidades en el camino";
                    answer.succes = false;
                    return answer;
                  }
                  console.log(
                    `([${x}],[${unitData.pos.y}]) no es un obstaculo`
                  );
                }
              }
            } else {
              //lo mismo con y
              if (move.movedSpaces > 0) {
                //si el movimiento es positivo
                for (let y = unitData.pos.y + 1; y < targetPosition.y; y++) {
                  //revisa todas las unidades hasta llegar a la posicion
                  if (match.map[unitData.pos.x][y] != null) {
                    console.log(`([${[unitData.pos.x]}],[${y}]) es obstaculo`);
                    answer.errorMessage = "error: hay unidades en el camino";
                    answer.succes = false;
                    return answer;
                  }
                  console.log(
                    `([${[unitData.pos.x]}],[${y}]) no es un obstaculo`
                  );
                }
              } else {
                //si el movimiento es negativo
                for (let y = unitData.pos.y - 1; y > targetPosition.y; y--) {
                  //revisa todas las unidades hasta llegar a la posicion
                  if (match.map[unitData.pos.x][y] != null) {
                    console.log(`([${[unitData.pos.x]}],[${y}]) es obstaculo`);
                    answer.errorMessage = "error: hay unidades en el camino";
                    answer.succes = false;
                    return answer;
                  }
                  console.log(
                    `([${[unitData.pos.x]}],[${y}]) no es un obstaculo`
                  );
                }
              }
            }
            //si no retorno error (no hay unidades en el medio)
            console.log("no hay unidades ne el medio");
            answer.errorMessage = "sin errores";
            answer.succes = true;
            return answer;
          } else {
            //en caso de que se tratara de mover mas de 1 espacio y no sea un scout
            answer.errorMessage = `error: solo los scouts(2) pueden moverse mas de 1 casilla, la unidad en ${unitData.pos.x},${unitData.pos.y} trato de moverse a ${targetPosition.x},${targetPosition.y}`;
            answer.succes = false;
            return answer;
          }
        }
      } else {
        answer.errorMessage = `error: las unidades no pueden moverse vertical o horizontalmente, la unidad en ${unitData.pos.x},${unitData.pos.y} trato de moverse a ${targetPosition.x},${targetPosition.y}`;
        answer.succes = false;
        return answer;
      }
    } else {
      answer.errorMessage = `error: posicion de destino invalida,  [${targetPosition.x}][${targetPosition.y}]`;
      answer.succes = false;
      return answer;
    }
  } else {
    answer.errorMessage = `error: la unidad no le pertenece al jugador`;
    answer.succes = false;
    return answer;
  }
  console.log();
  return answer;
};
module.exports = {
  isValidMovement,
};
