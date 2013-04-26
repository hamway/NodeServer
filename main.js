var http = require('http');
var app = require('app');
var api = require('api');
var stats = require('stats');

app.prepare();
stats.start();

http.createServer(function (req, res) {
    api.url = req.url;
    api.res = res;
    app.setServer();
    if(api.url != "/favicon.ico") {
        app.call();
    } else {
        app.favicon();
    }
    api.res.end();
}).listen(app.config.http.port, app.config.http.host);

console.log('Server running at http://' + app.config.http.host + ':' + app.config.http.port + '/');

