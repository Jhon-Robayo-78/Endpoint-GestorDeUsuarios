const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const hashingFunction = (word, callback) => {
  bcrypt.hash(word, parseInt(process.env.jumps), (err, hash) => {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      //console.log(hash)
      callback(null, hash);
    }
  });
};
const desHashingFunction = (word,hash,callback)=>{
  bcrypt.compare(word, hash, (err, result) => {
    if (err) {
      // Manejar el error
      console.log(err)
    } else if (result) {
      // Las contraseñas coinciden
      callback(result)
      console.log('Contraseña válida');
    } else {
      // Las contraseñas no coinciden
      callback(result)
      console.log('Contraseña inválida');
    }
  });
}
module.exports={hashingFunction, desHashingFunction};