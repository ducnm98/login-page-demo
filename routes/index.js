var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var Passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated())
    res.render('nextPage')
  else {
    console.log(req.isAuthenticated());
    res.render('index');

  }

});

router.post('/', (req, res, next) => {
  if (req.body.typeOfSubmit == 'signup') {
    password = bcrypt.hash(req.body.signuppass, 10, (err, hash) => {
      if (err) throw err;
      let insert = {
        username: req.body.signupuser,
        password: hash,
        email: req.body.signupemail
      };
      mongoose.model('userSchema').create(insert, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.render('nextPage')
      });
    })

  }
  else if (req.body.typeOfSubmit == 'login') {

  }
})



module.exports = router;
