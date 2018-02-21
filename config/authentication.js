
const
	mongoose = require('mongoose')

module.exports = {
	getUserById: function(id, callback) {
		mongoose.model('userSchema').findById(id, callback);
	}
};
