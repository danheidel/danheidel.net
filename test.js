var db = require('mysql');
var common = require('/var/www/common/common');

dbPool = db.createPool(common.dbVars);
dbPool.getConnection(function(err, connection){
  if(err){console.log(err); return;}
  connection.changeUser({database:'HYG'});
  connection.query('SELECT COUNT(StarID) FROM good_dist WHERE Distance < ?', 3, function(err, rows){
    if(err){console.log(err);return;}
    console.log(rows);
  });
});
