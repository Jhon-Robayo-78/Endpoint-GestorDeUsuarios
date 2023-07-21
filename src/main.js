const express = require('express');
const app = express();
const session = require('express-session'); 

//configuración del cors 
const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//configuración de sesiones
app.use(session({
  secret: 'PROJECTY.v1',
  resave: false,
  saveUninitialized: true
}));

//rutas
const { routes } = require('./Routes/routes');
app.use('/api',routes);

//lectura de .env
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3100;

//


app.use((req,res)=>{
  res.status(404).send({"status":"Error 404"}) 
})



// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
  });