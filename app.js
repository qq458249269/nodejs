var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//请求转发开始
var proxy = require('http-proxy-middleware');//引入代理模块
var port = 80;
var httpsport =8443; 
var apiProxy = proxy('/api', { target: 'http://localhost:8080/yxh',changeOrigin: true });
app.use('/', apiProxy);
app.get('/', function(req,res){
     res.sendFile(__dirname+'/public/admin/index/login.html');
});
app.listen(port, () => {   
  console.log('Listening on: http://localhost:'+port);
});
var https = require('https')
    ,fs = require("fs");

var options = {
    key: fs.readFileSync('./key/private.key'),
    cert: fs.readFileSync('./key/public.crt')
};

https.createServer(options, app).listen(httpsport, function () {
    console.log('Https server listening on port ' + httpsport);
});
//请求转发结束

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
