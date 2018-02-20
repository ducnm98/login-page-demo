var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var config = require('config');
var randomstring = require("randomstring");

router.get('/:typeOfSubmit/:username/:randomCode', function(req, res, next) {
  if (req.params.typeOfSubmit == 'resetPassword') {
    let query = {
      username: req.params.username,
      randomeCode: req.params.randomCode,
      clicked: false
    }
    mongoose.model('forgetpass').findOne(query).exec(function (err, result) {
      if (err) throw err;
      if (result) {
        res.render('resetPassword', {id: result._id, mess: ''})
      }
      else
        res.render('error', {message: 'Địa chỉ link không hợp lệ'})
    })
  }
});

router.post('/:id', function (req, res, next) {
  if (req.body.typeOfSubmit == 'resetPassword') {
    let query = {
      _id: req.params.id,
      clicked: false
    }
    let update = {
      clicked: true
    }
    let option = {
      new: false
    }
    mongoose.model('forgetpass').findOneAndUpdate(query, update, option).exec(function (err, result) {
      if (err) throw err;
      if (result) {
        var newPass = bcrypt.hash(req.body.resetPassword, 10, (err, hash) => {
          let query = {
            username: result.username,
            email: result.email
          }
          let update = {
            password: hash
          }
          let option = {
            new: false
          }
          mongoose.model('userSchema').findOneAndUpdate(query, update, option, function (err, result1) {
            if (err) throw err;
            console.log(result1);
            res.render('nextPage', {mess: 'Changed successfull'})
          })
        })

      }
    })
  }
})

module.exports = router;
