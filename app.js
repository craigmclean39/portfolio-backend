var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const mapRouter = require('./routes/map');

var app = express();

const tempLogger = (res, req, next) => {
  console.log(`req: ${req}`);
  next();
};

app.use(tempLogger);
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/map', mapRouter);

module.exports = app;
