let DB= require('../../models/users');
let fs = require('fs');
let mkdirp = require('mkdirp');
let correo;
let pass;

let createUser = function (req, res) {
    let nombre = req.body.nombre;
    let apellido= req.body.apellido;
    let nickname = req.body.nickname;
    let pass = req.body.pass;
    let correo = req.body.correo;
    let extencion = req.file.originalname.split(".")[req.file.originalname.split(".").length -1];
    let targetPath = '../ServerDB/Users/'+nickname+"."+correo+'/' + nickname+"_"+correo+"_ProfilePic" +"."+extencion;
    console.log(nombre);
    console.log(apellido);
    console.log(nickname);
    console.log(pass);
    console.log(correo);
    console.log(targetPath);

    mkdirp('../ServerDB/Users/'+nickname+"."+correo+'/', function(err) {

        if(!err){
            fs.rename(req.file.path, targetPath, function(err) {
                if (err) {

                    throw err;
                }


            });
        }

    });




    let src= nickname+"."+correo+'/' + nickname+"_"+correo+"_ProfilePic" +"."+extencion;
    DB.create(nombre, apellido, nickname, pass, correo, src, function(err, result) {

            if (err) {
                res.status(500).json(err);
                console.log(err);
            }else {
                res.status(200).json(result);

            }
        });

};



let getUsers = function (req, res) {
  //  res.status(200).json(users);
  //     res.status(500).json(error);
    let respuestaErr;
    correo=req.body.correo;
    pass=req.body.contrasena;
    comprobarUsuario(function (err,usuario) {
        if (err){
            if (err==="Contraseña no correcta"){
                console.log("Contraseña no correcta");
                respuestaErr= "Contraseña no correcta";
            } else if (err==="Correo no encontrado"){
                console.log("Correo no encontrado");
                respuestaErr= "Correo no encontrado";
            } else if (err==="problema con la db"){
                console.log("Problema con la base de datos");
                respuestaErr= "Problema con la base de datos";
            }
            res.status(500).json(respuestaErr);
        } else {
            console.log(usuario);
            res.status(200).json({
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                nickname: usuario.nickname,
                correo: usuario.correo,
                profilePic: usuario.imgsrc
                                 });
        }

    });

};

function comprobarUsuario(usuario) {
    let usuariorel;
    let err;

    DB.getAll(function(error, users) {
        if (!error) {
            let usuariosTodos=users;
          //  console.log(usuariosTodos);

            for (let i=0;i<usuariosTodos.length;i++){
                let user= usuariosTodos[i];
                if(user.correo===correo && user.pass===pass){
                    //  console.log("entro concidencia");
                    err=null;
                    usuariorel=user;
                    break;
                } else if (user.correo===correo && user.pass!==pass){
                    err="Contraseña no correcta";
                    usuariorel=null;
                    //  console.log("Contraseña no correcta");
                    break;
                }else if (user.correo!==correo){
                    err="Correo no encontrado";
                    //  console.log("Correo no encontrado");
                    usuariorel=null;
                }
            }

        } else {

            console.log(error);
            err="problema con la db";
            usuariorel=null;
        }
        usuario(err,usuariorel);
    });
}
 module.exports = {
     createUser,
     getUsers
 };
