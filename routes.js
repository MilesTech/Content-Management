var Todo = require('./models/todos.js');

module.exports = function(app, passport) {


//==================================================================
// route to test if the user is logged in or not
//==================================================================
app.get('/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});

// route to log in
app.post('/login', passport.authenticate('local'), function(req, res) {
  res.send(req.user);
});

// route to log out
app.post('/logout', function(req, res){
  req.logOut();
  res.send(200);
});
//==================================================================








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
	
//==================================================================
// Catch All
//==================================================================	
	
	 app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); 
    });
	
	

}
