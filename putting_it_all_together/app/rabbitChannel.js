/* globals console: false */
/* globals module: false */
/* globals process: false */
var create = function(amqp,user,password,host,exchange,exchangeType,exchangeOptions,config){
  var channel = false;
  return Promise.all([])
  .then(function(){
    return amqp.connect('amqp://'+user+':'+password+'@'+host);
  })
  .then(function(conn) {
//      process.once('SIGINT', function() {
//        conn.close();
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



module.exports.init = function(amqp,config){
  return create(amqp,config.user,config.password,config.host,config.exchange
    ,config.exchangeType,config.exchangeOptions,config);
};
