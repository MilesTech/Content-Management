var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.ObjectId;
  var Todo = mongoose.model('Todo', {
        text : String,
		notes: String,
		due: Date,
		assigned: ObjectId,
		day: String
    });
	
	
	
	
	module.exports = mongoose.model('Todo', Todo);