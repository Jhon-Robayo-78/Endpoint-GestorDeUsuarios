const {searchUser,create,update,log,Delete} = require('../../db/db');

const getUser = (req, res)=>{
    if(!req.body){
        res.status(404).json({"message":"error, not found"})
    }else{
        searchUser(req.body, (result)=>{
            res.status(200).json(result)
        });
    }
}
const putUser = (req,res)=>{
    if(!req.body){
        res.status(404).json({"message":"error, not found"})
    }else{
        update(req.body, (result)=>{
            res.status(200).json(result)
        });
    }
}
const postUser = (req, res)=>{
    if(!req.body){
        res.status(404).json({"message":"error, not found"})
    }else{
        log(req.body, (result)=>{
            if(result.status==500){
                res.status(500).json(result)
            }else if(result.status==401){
                res.status(200).json(result)
            }else{
                // Iniciar sesión
                req.session.user = result.user;
                res.status(200).json(result)
            }
        });
    }
}
const delUser = (req, res)=>{
    if(!req.body){
        res.status(404).json({"message":"error, not found"})
    }else{
        Delete(req.body, (result)=>{
            res.status(200).json(result)
        });
    }
}
const createUser = (req, res)=>{
    if(!req.body){
        res.status(404).json({"message":"error, not found"})
    }else{
        create(req.body, (result)=>{
            req.session.user = result.user;
            res.status(200).json(result)
        });
    }
}

const logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        res.status(500).json('error de servidor')
      }
      res.status(200).json('sesion terminada');
      //res.redirect('/login');
    });
  }
  

module.exports = {getUser, putUser, postUser, delUser,createUser,logout};