/*referencia tipo(type) de unidad:
0:bandera
1:espia
2:scout
3:minero
4-10:unidades comunes
11:bomba
*/
function fight(attaker, defender) {
  //recibe unit type
  //casos unicos que hay que revisar primero
  if (defender === null) {
    return {
      result: "gana el atacante",
      reason: `se avanzo a una casilla vacía`,
    };
  }
  if (attaker === defender) {
    return {
      result: "los 2 mueren",
      reason: `se ataco con un ${attaker} a un ${defender}, las unidades son iguales`,
    };
  }

  if (defender === 11) {
    if (attaker === 3) {
      return {
        result: "gana el atacante",
        reason: `se ataco con un ${attaker}(minero) a un ${defender}(mina), el minero desarma la mina`,
      };
    } else
      return {
        result: "gana el defensor",
        reason: `se ataco con un ${attaker} a un ${defender}, la unidad piso una mina`,
      };
  }
  //excepcion del espia
  if (attaker === 1) {
    return {
      result: "gana el atacante",
      reason: `se ataco con un ${attaker} a un ${defender} el espía siempre gana el ataque (salvo contra bombas(3))`,
    };
  }
  //criterio general
  if (attaker > defender) {
    return {
      result: "gana el atacante",
      reason: `se ataco con un ${attaker} a un ${defender}`,
    };
  } else {
    return {
      result: "gana el defensor",
      reason: `se ataco con un ${attaker} a un ${defender}`,
    };
  }
}
//testing tool
function checkUnits() {
  for (let attaker = 1; attaker < 11; attaker++) {
    console.log(`atacante: {${attaker}}`);
    for (let defender = 0; defender < 12; defender++) {
      console.log(`defender:${defender} ====>won:${fight(attaker, defender)}`);
    }
    console.log();
    console.log("-------");
    console.log();
  }
}
//checkUnits();
module.exports = { fight };
