//BASE DE DATOS SQLITE
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
db.run(`CREATE TABLE IF NOT EXISTS apikey (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    api TEXT
  )`);


function selectApi(res) {
    db.all(`SELECT * FROM apikey where api is not null`, function(err, rows) {
        if (err) {
          res.send(err.message);
        }
        
        if (rows.length >0) {
            rows.forEach(row => {
                res.send(row.api);
            });
        }else{
            res.send("empty")
        }
        
      });
      
}

function insertApi(apiSend) {
    db.run(`INSERT INTO apikey VALUES (null,?)`, [apiSend], function(err) {
        if (err) {
          return console.log(err.message);
        }
        console.log(`success `+apiSend);
      });
}

function deleteApi() {
    // Eliminar un usuario
    db.run(`DELETE FROM apikey`, function(err) {
        if (err) {
        return console.log(err.message);
        }
        
    });
  
}


module.exports = {
    selectApi,
    insertApi,
    deleteApi
};