// Imports
const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const app = express()
// const port = 5000

// from table 2

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
bodyParser = require('body-parser');


// allyson 
const mongoose = require('mongoose');

//conectar base de datos
const url2 = 'mongodb://localhost:27017/stockUpdate';
mongoose.connect(url2, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
  .then(db => console.log('Connected'))
  .catch(err => console.log(err));
//

// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

//
var indexRouter = require('./routes/index2');
// var usersRouter = require('./routes/users');

// Static Files
// app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))

// Set Templating Engine
app.use(expressLayouts)
// app.set('layout', './layouts/full-width')
app.set('layout', './layouts/full-width2')

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
