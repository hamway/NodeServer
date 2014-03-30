
/**
 * Module dependencies.
 */

var express = require('express'),
    errorHandler = require('express-error-handler'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    config = require('./config')();


var Index = require('./controllers/Index');
var Status = require('./controllers/Status');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views/templates'));
app.set('view engine', 'ejs');
app.use(require('express-ejs-layouts'));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes
app.all('/', function(req, res, next){
    Index.run(req, res, next);
});

// Status
app.all('/status', function (req,res,next) {
    Status.run(req,res,next);
});

app.all('/status/json', function (req,res,next) {
    Status.runJson(req,res,next);
});

app.all('/status*', function (req,res,next) {
    Status.runError(req,res,next);
});

var server = http.createServer(app);
app.use( errorHandler({server: server}) );

server.listen(config.port, function(){
  console.log('Express server listening on port ' + config.port);
});
