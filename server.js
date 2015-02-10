/*Define dependencies.*/
var express = require("express");
var app = express();
var multer  = require('multer');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');                  
var morgan = require('morgan');   
var session = require('express-session');     
var bodyParser = require('body-parser'); 
var methodOverride = require('method-override'); 
var secrets = require('./secrets.js'); 
var bCrypt = require('bcrypt-nodejs'); 

  
var done=false;





  
/*=================Config=============*/
mongoose.connect(secrets.mongoosedatabase());
app.use(express.static(__dirname + '/public'));  //sets public directory for front end
app.use(morgan('dev'));  //Logs all http requests to the console (for dev)
app.use(bodyParser.urlencoded({'extended':'true'})); 
app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(methodOverride());
app.use(session({ secret: 'Miles Tech' }));
  app.use(passport.initialize());
  app.use(passport.session());





/*Configure the multer.*/

/*app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
    return filename+Date.now();
  },
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path)
  done=true;
}
}));*/


require('./config/passport')(passport);
require('./routes.js')(app, passport); 





/*
app.post('/api/photo',function(req,res){
  if(done==true){
    console.log(req.files);
    res.end("File uploaded.");
  }
});*/





/*Run the server.*/
app.listen(3000,function(){
    console.log("Working on port 3000");
});