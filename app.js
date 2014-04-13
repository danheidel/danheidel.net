var express = require('express');

var app = express();
var port = process.argv[2];

if(typeof port === 'undefined'){
	console.error('no port defined!');
	process.exit();
}

// all environments
app.use(express.logger());
app.all('*', function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});
app.use(express.static(__dirname + '/public_html'));

app.listen(port);
console.log('serving danheidel.net on port: ' + port);

process.on('exit', function() {
});
