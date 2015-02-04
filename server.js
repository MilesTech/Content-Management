/*Define dependencies.*/
var express = require("express");
var app = express();
var multer  = require('multer');
var passport = require('passport')
var GoogleStrategy = require('passport-google').Strategy;
var mongoose = require('mongoose');                  
var morgan = require('morgan');    
var bodyParser = require('body-parser'); 
var methodOverride = require('method-override'); 
var secrets = require('./secrets.js'); 

  
var done=false;


/*=================Config=============*/
mongoose.connect(secrets.mongoosedatabase());
app.use(express.static(__dirname + '/public'));  
app.use(morgan('dev')); 
app.use(bodyParser.urlencoded({'extended':'true'})); 
app.use(bodyParser.json()); 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
app.use(methodOverride());


	var ObjectId = mongoose.Schema.ObjectId;
  var Todo = mongoose.model('Todo', {
        text : String,
		notes: String,
		due: Date,
		assigned: ObjectId,
		day: String
    });




 app.get('/api/todos', function(req, res) {
	 
        Todo.find(function(err, todos) {
            if (err){
                res.send(err)
			}
            res.json(todos);
        });
		
    });


    app.post('/api/todos', function(req, res) {
        Todo.create({
            text : req.body.text,
			notes : req.body.notes,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });






 app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); 
    });















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
}));



passport.use(new GoogleStrategy({
    returnURL: 'http://localhost/auth/google/return',
    realm: 'http://localhost/'
  },
  function(identifier, profile, done) {
    User.findOrCreate({ openId: identifier }, function(err, user) {
      done(err, user);
    });
  }
));


app.get('/auth/google', passport.authenticate('google'));


app.get('/auth/google/return', 
  passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login' }));



app.get('/',function(req,res){
      res.sendfile("index.html");
});

app.get('/login',function(req,res){
      res.sendfile("index.html");
});


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