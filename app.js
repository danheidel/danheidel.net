var express = require('express');

startup();

var app = express();

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

function startup(){
  console.log('starting as user: ' + process.env.USER);

  user = parseInt(process.env.NODEUSERID) || parseInt(process.argv[2]);
  if(!user){
    console.error('no user specified, exiting');
    process.exit();
  }

  //attempt to de-escalate user permissions
  try {
    process.setgid(user);
    process.setuid(user);
  } catch (e) {
    console.error('problem setting user/group, exiting');
    console.dir(e);
    process.exit();
  }
  console.log('user changed to: ' + user);

  port = parseInt(process.env.NODESERVERPORT) || parseInt(process.argv[3]);
  if(!port){
    console.error('no port defined, exiting');
    process.exit();
  }
}
