var Todo = require('./models/todos.js');
var User = require('./models/user.js');
var mongoose = require('mongoose');
module.exports = function(app, passport) {


//==================================================================
// route to test if the user is logged in or not
//==================================================================
app.get('/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});



// route to log out
app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.send("Unauthorized");
}


//==================================================================



   app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/register'
    }));


app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/login'
    }));



//==================================================================
// Todo Routes
//==================================================================
 app.get('/api/todos', function(req, res) {
	 
        Todo.find(function(err, todos) {
            if (err){
                res.send(err)
			}
            res.json(todos);
        });
		
    });

 app.get('/api/users', isLoggedIn, function(req, res) {
	 
        User.find(function(err, users) {
            if (err){
                res.send(err)
			}
            res.json(users);
        });
		
    });
	
	
	app.get('/api/users/:user_id', function(req, res) {
	 
       User.findById(req.params.user_id)
	   .populate('tasks')
	   .exec(function(err, doc){
		  res.json(doc);
	   });
		
    });
	

	

    app.post('/api/todos', function(req, res) {
        Todo.create({
            text : req.body.text,
			notes : req.body.notes,
			type : req.body.type,
			hours : req.body.hours,
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


    app.post('/api/todos/:todo_id', function(req, res) {
		var user       
		
			Todo.findOne({_id: req.params.todo_id}, function(err, todo){
				if(req.body.oldAssigned && !req.body.newAssigned){
					user = req.body.oldAssigned;
					todo.update({assigned: ""},function(err){});
					User.findByIdAndUpdate(user, {$pull: {tasks: mongoose.Types.ObjectId(req.params.todo_id)}}, function(err){done();});
					
				} else if(req.body.newAssigned && req.body.oldAssigned){
					user = req.body.newAssigned;
					todo.update({assigned: req.body.newAssigned},function(err){});
					User.findByIdAndUpdate(req.body.oldAssigned, {$pull: {tasks: mongoose.Types.ObjectId(req.params.todo_id)}}, function(err){
						User.findByIdAndUpdate(req.body.newAssigned, {$push: {tasks: mongoose.Types.ObjectId(req.params.todo_id)}}, function(err){done();});

						});
				
				} else {
					user = req.body.newAssigned;
					todo.update({assigned: req.body.newAssigned},function(err){});
					User.findByIdAndUpdate(user, {$push: {tasks: mongoose.Types.ObjectId(req.params.todo_id)}}, function(err){done();});
					
				}
			})
			

	   function done(){
	  		Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
	 
	   }

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
	
//==================================================================
// Catch All
//==================================================================	
	
	 app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); 
    });
	
	

}
