/**
 * Module dependencies.
 */

function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry+'\n');
    console.log(err);
}

var express = require('express'),
    MongoClient = require('mongodb'),
    ejs = require('ejs'),
    errorHandler = require('express-error-handler'),
    helpers = require('./helpers')(ejs),
    http = require('http'),
    path = require('path'),
    config = require('./config')(),
    raven = require('raven');

// Controllers init
var Index = require('./controllers/Index');
var Main = require('./controllers/Main');

// Server status
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
  //app.use(express.errorHandler());
  app.use(raven.middleware.express('http://4a2c0e27211a4ab5935a4bb35cffd6d9:4615289256f74213a1eb3749f3d7d72d@185.4.73.135/2'));
  app.use(onError);
}

/*server.listen(config.port, function(){
  console.log('Express server listening on port ' + config.port);
});*/

MongoClient.connect(config.db, function(err, db) {
    if(err) {
        console.log('Sorry, there is no mongo db server running.');
    } else {
        var attachDB = function(req, res, next) {
            req.db = db;
            next();
        };

        // Routes
        app.all('/', attachDB, function(req, res, next){
            Index.run(req, res, next);
        });

        app.all('/main', attachDB, function(req, res, next){
            Main.run(req, res, next);
        });

        app.all('/main/project/:id', function(req, res, next){
            Main.runProject(req, res, next);
        });

        app.all('/main/profile', function(req, res, next){
            Main.runProfile(req, res, next);
        });

        app.all('/main/logout', function(req, res, next){
            Main.runLogout(req, res, next);
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
    }
});