var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var admin = require("firebase-admin");
var firebase=require('firebase');
var config = {
    apiKey: "AIzaSyAGZ8ju7Rbo7cown_yTr_RE_S5M8TPe9k4",
    authDomain: "login-app-b3320.firebaseapp.com",
    databaseURL: "https://login-app-b3320.firebaseio.com",
    projectId: "login-app-b3320",
    storageBucket: "",
    messagingSenderId: "320421664309"
};
firebase.initializeApp(config);

var serviceAccount = require('./login-app-b3320-firebase-adminsdk-9uko3-1388e761c8.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://login-app-b3320.firebaseio.com"
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
