/* globals console: false */
/* globals module: false */
/* globals process: false */
var create = function(rabbitChannel,config){
  return function(user,password,host,exchange,exchangeType,exchangeOptions
      ,queOptions,topics){
    var channel = false,
    queue = false;
    return Promise.all([])
    .then(function(){
      return rabbitChannel.create(user,password,host,exchange
        ,exchangeType,exchangeOptions);
    })
    .then(function(ch){
      channel = ch;
      return channel.assertQueue('', queOptions);
    })
    .then(function(qok){
      queue = qok.queue;
      return Promise.all(topics.map(function(topic) {
        channel.bindQueue(queue, exchange, topic);
      }));
    })
    .then(function(){
      return {channel:channel,que:queue};
    });
  };
};


module.exports.init = function(amqp,rabbitChannel,config){
  return new Promise(function(resolve){
    resolve({create:create(amqp,rabbitChannel,config)});
  });
};