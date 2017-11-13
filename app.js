const express = require('express');
const bodyParser = require('body-parser');
// const todos = require('./todos');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const app = express();
const morgan = require('morgan');
const routes = require('./routes/');
const path = require('path');
const fs = require('fs');
const http = require('http');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const server = http.createServer(app);
const fileVersionControl = 'version.json';
const config = require('./config');
const jsonfile = require('jsonfile');
const uploadDir = path.join(__dirname, config.upload);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//mongodb & mongoose

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const dev_db_url = 'mongodb://scaffold83:80963319476@ds123695.mlab.com:23695/local_library'
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {
  useMongoClient: true,
  user: config.db.user,
  pass: config.db.password
});

const dbHandler = mongoose.connection;
dbHandler.on('error', console.error.bind(console, 'MongoDB connection error'));

//подключаем модели(сущности, описывающие коллекции базы данных)
require('./models/db-close');
require('./models/blog');
require('./models/pic');
require('./models/user');

const ModuleUser = require('./models/user');
const mainUser = new ModuleUser({
  login: 'kaurav',
  password: '80963319476'
});

mainUser.save((err) => {
  if (err) throw err;

  console.log('User created!');
});

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname,'public','img','favicon.ico')));

app.use(helmet());

app.use(morgan('dev'));

app.use(cookieParser());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use(session({
  secret: 'secret',
  key: 'keys',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: null
  },
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(compression());

app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);
app.use('/', require('./routes/index'));
app.use('/contact', require('./routes/mail'));
// app.use('/login', require('./routes/login'));
// app.use('/admin', require('./routes/admin'));

//02.11.2017
// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

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

// server.listen(3000, () => console.log('Сервер работает'));

// server.on('listening', function () {
  
// });

module.exports = app;