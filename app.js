var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();
console.log(process.env);

const mapRouter = require('./routes/map');

var app = express();

//Set up mongoose connection
const login = process.env.MONGODB_LOGIN;
var mongoose = require('mongoose');
var mongoDB = `mongodb+srv://${login}@sandbox.1gheh.mongodb.net/geodata?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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
