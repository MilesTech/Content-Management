var Todo = require('./models/todos.js');
var User = require('./models/user.js');

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
    res.send(200);
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

 app.get('/api/users', function(req, res) {
	 
        User.find(function(err, users) {
            if (err){
                res.send(err)
			}
            res.json(users);
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


    app.post('/api/todos/:todo_id', function(req, res) {
		       
	   Todo.update({_id: req.params.todo_id},  req.body, function(err){   
	  		Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
	   })
	
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
