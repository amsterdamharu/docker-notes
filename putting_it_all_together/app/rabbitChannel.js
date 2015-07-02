/* globals console: false */
/* globals module: false */
/* globals process: false */
var create = function(amqp,config){
  return function(user,password,host,exchange,exchangeType,exchangeOptions){
    var channel = false;
    return Promise.all([])
    .then(function(){
      console.log('... opening a connection')
      return amqp.connect('amqp://'+user+':'+password+'@'+host);
    })
    .then(function(conn) {
//      process.once('SIGINT', function() {
//        conn.close();
//        console.log('closed connection');
//        return 0;
//      });
      return conn.createChannel();
    })
    .then(function(ch) {
      channel = ch;
      return ch.assertExchange(exchange, exchangeType, exchangeOptions);
    })
    .then(function(){
      return channel;
    });
  };
};


module.exports.init = function(amqp,config){
  return new Promise(function(resolve){
    resolve({create:create(amqp,config)});
  });
};
