const express = require('express');
const bodyParser = require('body-parser');
// const todos = require('./todos');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const app = express();
const morgan = require('morgan');
const routes = require('./routes/index');
const path = require('path');
const http = require('http');
//--------------------------------------------------------------------------------------
const fs = require('fs');
const fileVersionControl = 'version.json';
const jsonfile = require('jsonfile');
//-------------------------------------------------------------------------------------
const debug = require('debug')('portfolio:server');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const server = http.createServer(app);
const config = require('./config');
const uploadDir = path.join(__dirname, config.upload);
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//mongodb & mongoose

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const devDBurl = 'mongodb://scaffold83:80963319476@ds123695.mlab.com:23695/local_library';
const mongoDB = process.env.MONGODB_URI || devDBurl;
mongoose.connect(mongoDB, {
  useMongoClient: true
});

const dbHandler = mongoose.connection;
dbHandler.on('error', function(err) {
  console.log('connection error: ', err.message);
});

dbHandler.once('open', function callback () {
  console.log("Connected to DB!");
});

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
//------------------------------------------------------------
const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);
//----------------------------------------------------------
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
//-------------------------------------------------------------------------------------------------------------------------
server.listen(port, () => console.log('Сервер работает'));
server.on('error', onError);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

server.on('listening', function () {
  jsonfile
    .readFile(fileVersionControl, function (err, obj) {
      if (err) {
        console.log('Данные для хеширования ресурсов из version.json не прочитаны');
        console.log('Сервер остановлен');
        process.exit(1);
      } else {
        app.locals.settings = {
          suffix: obj.suffix,
          version: obj.version
        };
        console.log('Данные для хеширования ресурсов из version.json прочитаны');

        //если такой папки нет - создаем ее
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir);
        }

        console.log('Express server started on port %s at %s', server.address().port, server.address().address);
      }
    });
});
//-----------------------------------------------------------------------------------------------------------------------
// module.exports = app;