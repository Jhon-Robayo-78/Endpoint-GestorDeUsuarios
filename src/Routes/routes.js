const express = require('express');
const routes = express.Router();
const { getUser, putUser, postUser, delUser, createUser, logout} = require('../callbacks/methods');

routes.get('/search',getUser); //obtener usuario
routes.get('/logout',logout); //cerrar sesión
routes.put('/log', putUser); //actualizar usuario
routes.post('/create', createUser); // creacion de usuario 
routes.post('/log', postUser); //login
routes.delete('/log',delUser); //eliminacion del usuario

module.exports = { routes };
