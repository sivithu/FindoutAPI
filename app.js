var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var activityRouter = require('./routes/activity');
var categoryRouter = require('./routes/category');
var placeRouter = require('./routes/place');
var notationRouter = require('./routes/notation');
var favorisRouter = require('./routes/favoris');
var disponibilityRouter = require('./routes/disponibility');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/activity', activityRouter);
app.use('/category', categoryRouter);
app.use('/place', placeRouter);
app.use('/notation', notationRouter);
app.use('/favoris', favorisRouter);
app.use('/disponibility', disponibilityRouter);
app.use('/public/images', express.static('public/images'));

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
