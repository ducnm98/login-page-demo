const
  nodemailer = require('nodemailer'),
  config = require('config'),
  express = require('express');

module.exports = {
  Send: function(sendTo, subject, Content){
    var mailOpts, smtpTrans;
    smtpTrans = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      SMTPAuth: true,
      SMTPSecure: 'tls',
      auth: {
        user: "hsvbot@gmail.com",
        pass: "ritwjjtrzuickikb"
      }
    });
    mailOpts = {
      from: 'Login Page Demo',
      to: sendTo,
      subject: subject,
      generateTextFromHTML: true,
      html: Content
    };
    smtpTrans.sendMail(mailOpts, (err, info) => {
      if (err) {
        console.log("Gui that bai");
      } else {
        console.log("Gui thanh cong");
      }
    });
  }
};
