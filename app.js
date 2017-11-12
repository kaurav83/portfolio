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
mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, {
  useMongoClient: true,
  user: config.db.user,
  pass: config.db.password
})
.catch(e => {
  console.error(e);
  throw e;
});

//подключаем модели(сущности, описывающие коллекции базы данных)
require('./models/db-close');
require('./models/blog');
require('./models/pic');
require('./models/user');

const dbHandler = mongoose.connection;
dbHandler.on('error', function(err) {
  console.log('connection error: ', err.message);
});

dbHandler.once('open', function callback () {
  console.log("Connected to DB!");
});

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

server.listen(3000, () => console.log('Сервер работает'));

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
