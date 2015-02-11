var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.ObjectId;
  var Todo = mongoose.model('Todo', {
        text : String,
		notes: String,
		due: Date,
		assigned: String,
		day: String,
		type: String,
		hours: Number
    });
	
	
	
	
	module.exports = mongoose.model('Todo', Todo);