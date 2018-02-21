var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var Passport = require('passport');
var randomstring = require('randomstring');
var ejs = require('ejs');
var sendEmail = require('./../api/sendEmail');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated())
    res.redirect('/nextPage')
    //res.render('nextPage', {mess: req.user.username})
  else {
    res.render('index', {mess: ''});
  }

});

router.post('/', (req, res, next) => {
  if (req.body.typeOfSubmit == 'signup') {
    let query = {
      username: req.body.signupuser
    }
    mongoose.model('userSchema').findOne(query).exec(function (err, result) {
      if (err) throw err;
      if (!result) {
        password = bcrypt.hash(req.body.signuppass, 10, (err, hash) => {
          if (err) throw err;
          let insert = {
            username: req.body.signupuser,
            password: hash,
            email: req.body.signupemail
          };
          mongoose.model('userSchema').create(insert, (err, result) => {
            if (err) throw err;
            res.render('nextPage', {mess: req.body.signupuser})
          });
        })
      }
      else {
        res.render('index', {mess: 'Username đã tồn tại'});
      }
    })
  }
  if (req.body.typeOfSubmit == 'reset') {
    let query = {
      email: req.body.forgetEmail
    }
    mongoose.model('userSchema').findOne(query).exec(function (err, result) {
      if (err) throw err;
      if (result) {
        let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        let randoms = randomstring.generate(50);
        let textLink = fullUrl + 'verify/resetPassword' + '/' + result.username +'/' + randoms;
        let query = {
          username: result.username,
          email: result.email,
          dateRequired: new Date(),
          randomeCode: randoms
        }
        mongoose.model('forgetpass').create(query, function (err, result1) {
          if (err) throw err;
          ejs.renderFile(__dirname + "/email_template/resetPassword.ejs", {
            name: result.username,
            action_url: fullUrl,
            reset_url: textLink,
          }, function (err, html) {
            if (err) throw err;
            let temp = randomstring.generate(3);
            let subject = "[" + temp + "]" + "- Xác nhận khôi phục mật khẩu";
            sendEmail.Send(result1.email, subject, html);
            res.render('nextPage', {mess: 'Gửi thành công'});
          })

        })
      }
      else
        res.render('index', {mess: 'Email không tồn tại'});
    })
  }

});



module.exports = router;
