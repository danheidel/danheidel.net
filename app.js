var express = require('express');
var dbCon = require('./node_modules/foo');
var app = express();
var port = process.argv[2];

if(typeof port === 'undefined'){
	console.error('no port defined!');
	process.exit();
}	

//init database access
dbCon.initDbPool({
  host: 'localhost',
  user: 'root',
  password: 'Ih35MV9XqLcS',
  database: 'HYG',
});

// all environments
app.use(express.logger());
app.use(express.static(__dirname + '/public_html'));
app.get('/test1', function(req, res){
  res.send(req.param('foo'));
});
app.get('/test2', function(req, res){
  res.send(req.params.foo);
});
app.get('/test3/:foo', function(req, res){
  res.send(req.param('foo'));
});
app.get('/test4/:foo', function(req, res){
  res.send(req.params.foo);
});
//db handler
app.get('/api/stardist/:dist', function(req, res){
  var dist = req.params.dist;
  //return empty set if no search query
  if(typeof dist ===' undefined'){
    console.log('empty query');
    res.send([]);
  }
  if(!(dbCon.isNumber(dist) && dist > 0)){
    console.log('invalid query format');
    res.send([]);
  }else{
    console.log('query for: ' + dist);
    dbCon.dbQuery('SELECT StarID, BayerFlamstead, ProperName, Distance, AbsMag, Spectrum, ColorIndex, CalcSpectrum FROM good_dist WHERE Distance < ' + dist, function (err, rows){
      if (err){
        console.log(err);
        res.send(err);
      }else{
        console.log(rows.length + ' rows sent');
        res.send(rows);
      }      
    });
  }
});

app.listen(port);
console.log('serving danheidel.net on port: ' + port);

process.on('exit', function() {
});

