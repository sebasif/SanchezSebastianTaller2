let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let multer = require('multer');
let userUpload=multer({dest : '../temp/uploads/'}).single('profilePic');

let routes = require('./routes/index');


let dbsql = require('./DBMYSQL/index');

let cors = require('cors')


let app = express();

app.use(cors());

/*
function _inicializeModels () {
   dbsql.connectar(function (err) {
       if(err){
           console.log('Unable to connect to MySQL.');
           process.exit(1)
       } else {
           console.log('conectado a db')
       }
   });
}

_inicializeModels();
*/


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'ServerDB')));


    app.use('/api',userUpload, routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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

module.exports = app;
