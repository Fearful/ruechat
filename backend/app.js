
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('error-handler'),
  morgan = require('morgan'),
  http = require('http'),
  path = require('path'),
  port = process.env.PORT || 3000;

var app = module.exports = express(),
  server = require('http').Server(app),
  p2pserver = require('socket.io-p2p-server').Server,
  io = require('socket.io')(server),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;
require('./events/index.js')(io);
/**
 * Configuration
 */

// all environments
app.set('views', path.join(__dirname, '../frontend/views'));
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '25mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '25mb'}));
app.use(methodOverride());
/**
  Passport and mongoose config
*/
app.use(require('express-session')({
    secret: 'c0derevoluti0n',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
var Account = require('./model/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
mongoose.connect('mongodb://localhost/rueChat');

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  // app.use(express.errorHandler());
}

// production only
if (env === 'production') {
  // TODO
}


/**
 * Routes
 */

require('./routes/index')(app);

/**
 * Start Server
 */
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});
io.use(p2pserver);