var mysql  = require('mysql');  
 
var connection = mysql.createConnection({     
  host     : '106.14.203.125',       
  user     : 'root',              
  password : 'caojianjun666',       
  port: '3306',                   
  database: 'offer_center', 
}); 
 


function INSERT(addSql,addSqlParams,cb){
  connection.connect();
   
  // var  addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)';
  // var  addSqlParams = ['菜鸟工具', 'https://c.runoob.com','23453', 'CN'];
  //增
  connection.query(addSql,addSqlParams,function (err, result) {
          if(err){
             console.error('[INSERT ERROR] - ',err.message);
             return;
          }        
         // console.log('--------------------------INSERT----------------------------');
         //console.log('INSERT ID:',result.insertId);        
         console.log('INSERT ID:',result);        
         // console.log('-----------------------------------------------------------------\n\n');  
  });
  connection.end();
}

function UPDATE(modSql,modSqlParams,cb){
  connection.connect();
  
  // var modSql = 'UPDATE websites SET name = ?,url = ? WHERE Id = ?';
  // var modSqlParams = ['菜鸟移动站', 'https://m.runoob.com',6];

  //修改
  connection.query(modSql,modSqlParams,function (err, result) {
          if(err){
             console.error('[update ERROR] - ',err.message);
             return;
          }        
         // console.log('--------------------------INSERT----------------------------');
         //console.log('INSERT ID:',result.insertId);        
         console.log('INSERT ID:',result);        
         // console.log('-----------------------------------------------------------------\n\n');  
  });
  connection.end();
}

function SELECT(selSql){
  connection.connect();
   
  // var  selSql = 'SELECT * FROM company';
  //查
  connection.query(selSql,function (err, result) {
          if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
          }
   
         // console.log('--------------------------SELECT----------------------------');
         console.log(result);
         // console.log('------------------------------------------------------------\n\n');  
  });
   
  connection.end();
}

function DELETE(delSql){
  // var delSql = 'DELETE FROM websites where id=6';
  //删
  connection.query(delSql,function (err, result) {
          if(err){
            console.log('[DELETE ERROR] - ',err.message);
            return;
          }        
   
         // console.log('--------------------------DELETE----------------------------');
         console.log('DELETE affectedRows',result.affectedRows);
         // console.log('-----------------------------------------------------------------\n\n');  
  });
  connection.end();
}

// exports.test = test;
exports.SELECT = SELECT;
exports.DELETE = DELETE;
exports.UPDATE = UPDATE;
exports.INSERT = INSERT;