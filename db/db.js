const mysql2 = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();
const {hashingFunction, desHashingFunction} = require('../src/callbacks/security');
const {messageQuery} = require('../src/callbacks/messageQuery');

const host = process.env.host || ''
const userdb = process.env.user || 'root'
const password_db = process.env.password || ''
const database = process.env.database || ''
const portdb = process.env.db_port || 3306

const connection = mysql2.createConnection({
    host: host,
    user: userdb,
    password:password_db,
    database: database,
    port: portdb
});

connection.connect((err)=>{
    if(err) throw err;
    console.log("Connect to MySQL")
});

//methods
//obtener usuario------------------------------------------------------------------------------------------
const searchUser = (data, callback)=>{
  const dbSerach = (query)=>{
    connection.query(query, (err, result)=>{
      try{
        if(err)throw err;
        callback(result);
      }catch(error){
        console.error('Se produjo el siguiente error: ',error);
        callback({'message':'usuario o email erróneos'});
      }

    });
  }
  const dataOfuser = messageQuery(data.message);
  console.log(dataOfuser);
  const queryValidation = (obj)=>{
    if(obj.email==null && obj.nickname==null){
      callback({message:'digite un nickname o un email para buscar si desea ser más preciso separelo con una coma(,). '})
      return;
    }
    else if(obj.email==null && obj.nickname!=null){
      let query = `select nickname,email from usuario where nickname="${obj.nickname}";`;
      dbSerach(query);
    }else if(obj.email!=null && obj.nickname!=null){
      let query = `select nickname,email from usuario where email="${obj.email}" and nickname="${obj.nickname}";`;
      dbSerach(query);
    }else{
      let query = `select nickname,email from usuario where email="${obj.email}";`;
      dbSerach(query);
    }

  }
  queryValidation(dataOfuser);
}
//creacion de usuario-----------------------------------------------------------------------------------------------------------------------
  const create = (data, callback) => {
    hashingFunction(data.password, (err, hash) => {
      if (err) {
        console.error('Error al generar el hash de la contraseña:', err);
        callback({ state: null, message: 'Error al crear el usuario. Por favor, inténtalo de nuevo más tarde.' });
      } else {
        let query = `INSERT INTO usuario VALUES (0, '${data.nickname}', '${data.contactNumber}', '${data.email}', '${hash}');`;
        connection.query(query, (err, result) => {
          try {
            if (err) {
              throw err; // Lanza una excepción en caso de error
            }
            connection.query(`select id, nickname, contactNumber, email from usuario where email="${data.email}";`,(err,result2)=>{
              if(err)throw err;
              callback({'message':'creado y logueado','user':result2[0]});
            });
            
          } catch (error) {
            // Manejo del error
            console.error('Error al crear el usuario:', error);
            if (error.code === 'ER_DUP_ENTRY') {
              callback({ state: null, message: 'Error al crear el usuario. El correo electrónico puede estar duplicado.' });
            } else {
              callback({ state: null, message: 'Error al crear el usuario. Por favor, inténtalo de nuevo más tarde.' });
            }
          }
        });
      }
    });
  };
//actualizar usuario---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const update = (data, callback)=>{
  hashingFunction(data.password,(err,hash)=>{
    if (err) {
      console.error('Error al generar el hash de la contraseña:', err);
      callback({ state: null, message: 'Error al actualizar el usuario. Por favor, inténtalo de nuevo más tarde.' });
    } else{
      let query = `UPDATE usuario SET nickname="${data.nickname}", contactNumber="${data.contactNumber}" , email="${data.newEmail}", password="${hash}"  WHERE email="${data.oldEmail}";`;
      connection.query(query, (err, result)=>{
        try{
          if(err)throw err;
          callback(result);
        }catch(error){
          // Manejo del error
          console.error('Error al crear el usuario:', error);
          if (error.code === 'ER_DUP_ENTRY') {
            callback({ state: null, message: 'Error al actualizar el usuario. El correo electrónico puede estar duplicado.' });
          } else {
            callback({ state: null, message: 'Error al actualizar el usuario. Por favor, inténtalo de nuevo más tarde.' });
          }
        }     
      })
    }
  })
    
}
//login---------------------------------------------------------------------------------------------------------------------------------------------------
const log = (data, callback)=>{
  //const {email, password} = data;
  let querySearch = `SELECT id,nickname,password from usuario where email="${data.email}"`;
    
    connection.query(querySearch, (err, result)=>{
      if (err) {
        console.error('Error al consultar la base de datos:', err);
        callback({'status':500,'message':'Error al iniciar sesión'})//res.status(500).send('Error al iniciar sesión'));
        //return;
      }else if (result.length == 0) {
        callback({'status':401,'message':'Correo electrónico incorrecto'})
        //res.status(401).send('Correo electrónico incorrecto');
        //return;
      }else{
        const user = result[0];
        desHashingFunction(data.password, user.password, (verified)=>{
          if(!verified){
            callback({'status':401,'message':'Contraseña incorrecta'})
            return;
          }
          callback({'status':200,'message':'logueado','user':user})
        });
      }
    })
}
//eleminar usuario------------------------------------------------------------------------------------------------------------------------------
const Delete = (data, callback)=>{
  let queryDelete = `DELETE from usuario where email="${data.email}"`;
  let querySearch = `SELECT * from usuario where email="${data.email}"`;
  
    connection.query(querySearch, (err, result)=>{
      try{
        if(err)throw err;
        desHashingFunction(data.password,result[0].password, (validacion)=>{
          if(validacion){
            connection.query(queryDelete,(err,resultado)=>{
              if(err)throw err;
              callback(resultado)
            })
          }else{
            callback(false)
          }
        })
      }catch(error){
        console.error('Error usuario :',error);
        callback({'message':'usuario no existe'});
      }  
        

    })
  
}


module.exports = {searchUser,create,update,log,Delete};