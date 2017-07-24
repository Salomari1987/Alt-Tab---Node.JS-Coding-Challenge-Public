'use strict';

let express = require('express');
let mongoose = require('mongoose');
let db = mongoose.connection;
let app = express();

let PORT = process.env.PORT || 8000;
let dbconfigs = require('./configs/dbconfigs.js');
let routes = require('./routes/routes.js');

db.on('error', console.error);

db.once('open', function () {
  console.log('mongoDB is open');
});

//Imports go here (routes, configs, etc)
require('./configs/middlewares.js')(app, express);

mongoose.connect('mongodb://' + dbconfigs.dbHost + '/' + dbconfigs.dbName);

routes(app, express);

app.use('/', express.static('app_client'));

app.listen(PORT, function () {
  console.log('Listening on port', PORT);
});

app.on ('uncaughtException', function () {
  //Close connection
  app.close();
});

// On kill
app.on('SIGTERM', function() {
  app.close();
});

//On exit
app.on('exit', function() {
  app.close();
});

module.exports = app;
