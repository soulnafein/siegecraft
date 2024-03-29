var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
app.configure(function() {
  app.use(express.static(path.join(__dirname, "public")));
});

app.get('/', function(request, response) {
  response.send('Hello World!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

http.createServer(app);

