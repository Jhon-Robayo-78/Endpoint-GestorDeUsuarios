# Endpoint-GestorDeUsuarios
api desarrollada en nodeJS/express con MySQL, servicio de creación de usuarios y login

Realizado por:

_Jonathan  Robayo_ 

## commandos de terminal 

## `npm install`
Instala los paquetes necesarios para funcionar correctamente la aplicación.

## `npm start`
Inicia la aplicación en `localhost:3100` por defecto, a menos que haga uso de un .env y se declare el port.

# rutas endpoint 

## `/api/create`
mediante el método **GET**, recibe un json con keys: nickname,contactNumber, email y password, se procede a almacenarse para su uso posterior.

## `/api/log`
Este endpoint hace uso de tres métodos http

#### PUT
Encargado de recibir json con las props actualizadas o no del usuario, se valida si el email ya existe en la DB si existe se rechaza y la operación se cancela sin que el programa se detenga. 
#### DELETE
Empleado para la elimininación de cuentas, se le pide al usuario su contraseña para validar su eliminación.
#### POST 
Validador de seguridad del usuario comúnmente.

## `/api/logout`
es un apartado prototipo de manejo de sesión no explotado en la app, si se incia al logearse o al crear una cuenta, y esta ruta es para concluir sesión.

## `/api/search`
Es empleado como un prototipo de buscardor en la DB, mediante nombre de usuario y email.
