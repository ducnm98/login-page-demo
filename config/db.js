
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/login-page-demo');

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

var forgetpass = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  dateRequired: {
    type: Date,
    required: true
  },
  randomeCode: {
    type: String,
    required: true
  },
  clicked: {
    type: Boolean,
    default: false
  }
});

var historyLogin = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  dateLogin: {
    type: Date,
    required: true
  }
});

var userSchema = mongoose.model('userSchema', userSchema);
var forgetpass = mongoose.model('forgetpass', forgetpass);
var historyLogin = mongoose.model('historyLogin', historyLogin);

module.exports = {
  userSchema: userSchema,
  forgetpass: forgetpass,
  historyLogin: historyLogin
};
