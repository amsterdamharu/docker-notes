var WebSocketServer = require('../../').Server
  , https = require('https')
  , express = require('express')
  , fs = require('fs')
  , cfg = {
        ssl: true,
        port: 8080,
        ssl_key: '/app/certs/server/my-server.key.pem',
        ssl_ca: '/app/certs/server/my-root-ca.crt.pem',
        ssl_cert: '/app/certs/server/my-server.crt.pem'
    }
  , app = express();

app.use(express.static(__dirname + '/public'));

var server = https.createServer({

            // providing server with  SSL key/cert
            key: fs.readFileSync( cfg.ssl_key ),
            ca: fs.readFileSync( cfg.ssl_ca ),
            cert: fs.readFileSync( cfg.ssl_cert )

        },app);
server.listen(8080);

var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(process.memoryUsage()), function() { /* ignore errors */ });
  }, 100);
  console.log('started client interval');
  ws.on('close', function() {
    console.log('stopping client interval');
    clearInterval(id);
  });
});
