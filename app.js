var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var db = require('./config/db');
var Passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = require('config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(Passport.initialize());
app.use(Passport.session());

app.use(session({
	secret: 'mysecret',
	cookie: {
		maxAge: 1000*60*60*24 // 24 tiếng
	}
}));

var index = require('./routes/index');
var users = require('./routes/users');
var nextPage = require('./routes/nextPage');
var verify = require('./routes/verify');

app.use('/', index);
app.use('/users', users);
app.use('/nextPage', nextPage);
app.use('/verify', verify);

app.route('/login')
	.get(function (req, res) {
		res.render('login', {mess: ''})
	})
	.post(Passport.authenticate('local', {
		failureRedirect: '/login/error',
		successRedirect: '/nextPage/',
		failureFlash: true}), (req, res) => {
			res.redirect('/nextPage', {mess: req.body.username});
});

app.route('/login/:mess')
	.get(function (req, res) {
		if (req.params.mess == 'error')
			res.render('login', {mess: 'Lỗi đăng nhập, sai tài khoản hoặc mật khẩu!'})
		else res.render('login', {mess: ''})
	})
	.post(Passport.authenticate('local', {
		failureRedirect: '/login/err',
		successRedirect: '/nextPage/',
		failureFlash: true}), (req, res) => {
			res.redirect('/nextPage', {mess: req.body.username});
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function ensureAuthenticated (req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login');
	};
};

app.use(flash());
//Global Vars
app.use((req, res, next) => {
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});


Passport.use(new LocalStrategy (
	(username, password, done) => {
		mongoose.model('userSchema').findOne({username: username}, function(err, userDoc){
			if (err) {
				return done(err);
			}
			if (userDoc){
				bcrypt.compare(password, userDoc.password, function(err, isMatch){
					if(err) throw err;
					if (isMatch){
						userDoc.password=null
						userDoc.email=null
						return done(null, userDoc);
					}
					return done(null, false);
				});
			} else {
				return done(null, false);
			}
		});
	}
));

Passport.serializeUser((user, done) => {
	done(null, user.id);
});

Passport.deserializeUser((name, done) => {
  mongoose.model('userSchema').findById(name, (err, user) => {
		done(err, user);
	});
});

module.exports = app;
