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
        successRedirect : '/account', // redirect to the secure profile section
    }));


app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/dashboard', // redirect to the secure profile section
       
    }));



//==================================================================
// Todo Routes
//==================================================================

 app.get('/api/users', isLoggedIn, function(req, res) {
	 
        User.find()
		.populate('tasks')
	   .exec(function(err, users) {
            if (err){
                res.send(err)
			}
            res.json(users);
        });
		
    });
	
	
	app.get('/api/team', isLoggedIn, function(req, res) {
	 
        User.find({role: 'team'})
		.populate('tasks')
	   .exec(function(err, users) {
            if (err){
                res.send(err)
			}
            res.json(users);
        });
		
    });
	
	
	app.get('/api/users/:user_id', isLoggedIn, function(req, res) {
       User.findById(req.params.user_id)
	   .populate('tasks')
	   .exec(function(err, doc){
		  res.json(doc);
	   });
		
    });
	
	
	
	 app.get('/api/todos', isLoggedIn, function(req, res) {
	 
	 Todo.find()
	 .populate('assigned')
	 .exec(function(err, todos){
		  if (err){
			  console.log(err)
                res.send(err)
			}
		res.json(todos)
	 });
	 
       /* Todo.find({}, function(err, todos) {
            if (err){
                res.send(err)
			}
            res.json(todos);
        });*/
		
    });

	
	
	
	
	
	app.post('/api/users/:user_id', isLoggedIn, function(req, res) {
	 
	 var todoArray = req.body.tasks;

		 for (i=0; i<todoArray.length;i++){
			todoArray[i] =  mongoose.Types.ObjectId(todoArray[i])
		 }
		
		 User.findByIdAndUpdate(req.params.user_id, {$set: {tasks: todoArray}}, 
			function(err, user){

			res.json(user)
		});
	
    });
	
	
	
	
	app.get('/api/account', isLoggedIn, function(req, res) {
	
       User.findById(req.session.passport.user)
	   .populate('tasks')
	   .exec(function(err, doc){
		  res.json(doc);
	   });
		
    });
	
	
		app.post('/api/account/:user_id', isLoggedIn, function(req, res) {		
			
		 User.findByIdAndUpdate(req.params.user_id, {$set: req.body}, 
			function(err, user){
				
			res.json(user)
		});
	
    });

	

    app.post('/api/todos', isLoggedIn, function(req, res) {
        Todo.create({
            text : req.body.text,
			notes : req.body.notes,
			type : req.body.type,
			hours : req.body.hours,
			client : req.body.client,
			working : false,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);
                	res.json(todo);
          
        });

    });



   app.get('/api/todos/:todo_id', isLoggedIn, function(req, res) {
		
		Todo.findOne({_id: req.params.todo_id}, function(err, todo){
			res.json(todo)
		});
		
    });


    app.post('/api/todos/:todo_id', isLoggedIn, function(req, res) {
		
		if (req.body.pull && req.body.assigned){
			User.update({tasks: req.params.todo_id}, {$pull: {tasks: req.params.todo_id}}, 
			function(err,  user){
				Todo.update({_id: req.params.todo_id},
			 { $set: req.body }, function(err, doc){ res.send(200)})
				})
			return;
		} 
			
			if (req.body.assigned == false){
				User.update({tasks: req.params.todo_id}, {$pull: {tasks: req.params.todo_id}}, 
			function(err,  user){
				Todo.update({_id: req.params.todo_id},
			 { $unset : {assigned: "" } }, function(err, doc){ res.send(200)})
				})
			return;
			}
			

			Todo.findByIdAndUpdate(req.params.todo_id,
			 { $set: req.body }, function(err, doc){ res.json(doc)})
			
				
    });



    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);
				
			User.update({tasks: req.params.todo_id}, {$pull: {tasks: req.params.todo_id}}, 
			function(err,  user){})
			
            // get and return all the todos after you create another
            Todo.find({assigned : ""}, function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });
	
//==================================================================
// Catch All
//==================================================================	
	
		 app.get('/api/session', function(req, res) {
        res.send({user_firstname: req.user.firstname, user_lastname: req.user.lastname, user_role: req.user.role, user_email: req.user.email, user_id: req.user._id})
		
    });
	
	 app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); 
		
    });
	
	
	

}
