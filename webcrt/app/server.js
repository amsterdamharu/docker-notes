var express = require('express'),
  app = express(),
  ExpressPeerServer = require('peer').ExpressPeerServer,
  options = {
    debug: true
  };

app.use(express.static('static'));



var server = app.listen(8888, function() {
    console.log('Listening on port %d', server.address().port);
});

app.use('/myapp', ExpressPeerServer(server, options));
