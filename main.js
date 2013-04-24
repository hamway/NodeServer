var http = require('http');
var url = require('url');
var app = require('app');

app.prepare();
/*
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  parse_url(res, req.url);
  res.end();
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');

function parse_url(res, parsed) {
  if(parsed == "/favicon.ico") {
    res.end();
  } else {
      params = url.parse(parsed);
      switch (params.pathname) {
          case "/getCountry":

              break;
          default: res.write('Api method not registred');
      }
    console.log(url.parse(parsed));
  }
}*/
