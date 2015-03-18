var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.ObjectId;
  var Todo = mongoose.model('Todo', {
        text : String,
		notes: String,
		due: Date,
		assigned: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
		working: Boolean,
		type: String,
		hours: Number,
		done : Boolean,
		client: String
    });
	

	module.exports = mongoose.model('Todo', Todo);