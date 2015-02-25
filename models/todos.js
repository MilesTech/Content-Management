var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.ObjectId;
  var Todo = mongoose.model('Todo', {
        text : String,
		notes: String,
		due: Date,
		assigned: String,
		working: Boolean,
		type: String,
		hours: Number,
		done : Boolean
    });
	
	
	
	
	module.exports = mongoose.model('Todo', Todo);