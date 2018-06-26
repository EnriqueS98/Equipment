var express = require("express");
var Zombie = require("./models/zombie");
var Equipament = require("./models/equipament");
var passport = require("passport");

var router = express.Router();

router.use((req,res,next)=>{
    res.locals.currentZombie = req.zombie;
    /*res.locals.currentArma = req.arma;*/
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

router.get("/",(req,res,next)=>{
    Zombie.find()
    .sort({createdAt: "descending"})
    .exec((err,zombies)=> {
        if(err){
            return next(err);
        }
        res.render("index",{zombies: zombies});
    });  
});
router.get("/signup",(req,res)=>{
    res.render("signup");
});

router.post("/signup",(req,res,next)=>{
    var username = req.body.username;
    var password = req.body.password;

    Zombie.findOne({username: username},(err,zombie)=>{
        if(err){
            return next(err);
        }
        if(zombie){
            req.flash("error","El nombre de usuario ya lo ha tomado otro zombie");
            return res.redirect("/signup");
        }
        var newZombie = new Zombie({
            username: username,
            password: password
        });
        newZombie.save(next);
        return res.redirect("/");
    });
    });

    router.get("/zombies/:username",(req,res,next)=>{
        Zombie.findOne({ username:req.params.username},(err,zombie)=>{
            if(err){
                return next (err);

            }
            if (!zombie){
                return next(404);
            }
            res.render("profile",{zombie: zombie}); 
    });
});


router.get("/equipamento",(req,res)=>{
    res.render("equipamento");
    
});
router.post("/equipamento",(req,res,next)=>{
    var descripcion = req.body.descripcion;
    var defensa = req.body.defensa;
    var categoria = req.body.categoria;
    var peso = req.body.peso;

        var newEquipament = new Equipament({
            descripcion: descripcion,
            defensa: defensa,
            categoria: categoria,
            peso: peso
        });
        newEquipament.save(next);
        return res.redirect("/equipamento_list");
    });

    router.get("/equipamento_list",(req,res,next)=>{
        Equipament.find()
        .sort({ createdAt: "descending"})
        .exec((err,equipamento)=> {
            if(err){
                return next(err);
            }
            res.render("equipamento_list",{equipamento: equipamento});
        });  
    });
module.exports = router;

    