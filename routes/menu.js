const express=require("express");
const router = express.Router();


//mi idea es que esto sea para la seleccion de partida
router.get('/', (req, res) => {
    res.sendFile('views/menu.html',{root:'./public'});
});

module.exports= router;