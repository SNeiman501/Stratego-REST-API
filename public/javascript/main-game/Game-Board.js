// this file handles all the code in order to display menu to select units on the game board

let unitBombs = ["item", "item", "item", "item", "item", "item"];
let unitMarshall = ["item"];
let unitGeneral = ["item"];
let unitColonel = ["item", "item"];
let unitMajor = ["item", "item", "item"];
let unitCaptain = ["item", "item", "item", "item"];
let unitLieutenant = ["item", "item", "item", "item"];
let unitSergeant = ["item", "item", "item", "item"];
let unitMiner = ["item", "item", "item", "item", "item"];
let unitScout = [
  "item",
  "item",
  "item",
  "item",
  "item",
  "item",
  "item",
  "item",
];
let unitSpy = ["item"];
let unitFlag = ["item"];

const menuUnits = document.querySelector(".dropdown-menu");
const squares = document.querySelectorAll(".board-grid div");
let setingUnitsMode = true;
let square;

function cleanBorder() {
  squares.forEach((e) => {
    e.classList.remove("border-selected-square");
  });
}

function setUnit(item, condition, imgSrc) {
  switch (item) {
    case "captain":
      if (unitCaptain.length != 0 && condition === "true") {
        unitCaptain.pop();
        square.classList.add("captain-selected");
        square.style.background = `no-repeat center/100% url(${imgSrc})`;
        square.style.backgroundSize = `cover`;
        menuUnits.classList.remove("active");
        return unitCaptain;
      } else if (condition === "clear") {
        unitCaptain.push("item");
        square.style.background = "";
        menuUnits.classList.remove("active");
        square.classList.remove("captain-selected");
        return unitCaptain;
      }
    case "colonel":
      if (unitColonel.length != 0 && condition === "true") {
        unitColonel.pop();
        square.classList.add("colonel-selected");
        square.style.background = `no-repeat center/100% url(${imgSrc})`;
        square.style.backgroundSize = `cover`;
        menuUnits.classList.remove("active");
        return unitColonel;
      } else if (condition === "clear") {
        unitColonel.push("item");
        square.style.background = "";
        menuUnits.classList.remove("active");
        square.classList.remove("colonel-selected");
        return unitColonel;
      }
  }
}

document.addEventListener("click", (e) => {
  if (e.target.matches("#units-menu, #units-menu *")) {
  } else {
    cleanBorder();
  }
  if (e.target.matches("#units-menu img")) {
    if (square.classList[0] == "setupMode") {
      if (
        e.target.matches(`#${e.target.id}`) &&
        square.style.background == ""
      ) {
        console.log("Available");
        setUnit(e.target.id, "true", e.target.src);
      } else if (
        e.target.matches(`#${e.target.id}`) &&
        square.classList.contains(`${e.target.id}-selected`)
      ) {
        setUnit(e.target.id, "clear", e.target.src);
      } else if (
        e.target.matches(`#${e.target.id}`) &&
        !square.classList.contains(`${e.target.id}-selected`)
      ) {
        console.log("trying to replace unit");
        square.classList.slice(1);
      }
    } else {
      alert("You can only set your units in the first 4 rows (Bottom to top)");
    }
  }
  if (e.target.matches(".board-grid div")) {
    menuUnits.classList.add("active");
    e.target.classList.toggle("border-selected-square");
    square = e.target;
  }
  if (!e.target.matches(".board-grid div, #units-menu, #units-menu *")) {
    menuUnits.classList.remove("active");
  }
});
