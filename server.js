/*Define dependencies.*/
var express = require("express");
var app = express();
var http = require('http');

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
var aws = require('aws-sdk');
  




  
/*=================Config=============*/
//mongoose.connect(process.env.mongo);
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

app.set('port', (process.env.PORT || 3000));


var AWS_ACCESS_KEY = process.env.AWSAccessKey;
var AWS_SECRET_KEY = process.env.AWSSecretKey;
var S3_BUCKET = process.env.S3BucketName



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



app.get('/sign_s3', function(req, res){
    aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
    var s3 = new aws.S3();
    var s3_params = {
        Bucket: S3_BUCKET,
        Key: req.query.s3_object_name,
        Expires: 60,
        ContentType: req.query.s3_object_type,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.query.s3_object_name
            };
            res.write(JSON.stringify(return_data));
            res.end();
        }
    });
});





/*
app.post('/api/photo',function(req,res){
  if(done==true){
    console.log(req.files);
    res.end("File uploaded.");
  }
});*/



var io = require('socket.io').listen(app.listen(app.get('port'),function(){
    console.log("Working on port 3000");
}));


io.sockets.on('connection', function (socket) {
	console.log('connected user');
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});



