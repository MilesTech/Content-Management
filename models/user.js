var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


var User = mongoose.Schema({
    email: String,
    password: String,
	firstname: String,
	lastname: String,
	role: String
});


// methods ======================
// generating a hash
User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

User.methods.toJSON = function(){
	var obj = this.toObject();
	delete obj.password;
	return obj
}

// create the model for users and expose it to our app
module.exports = mongoose.model('User', User);