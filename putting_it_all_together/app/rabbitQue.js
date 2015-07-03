/* globals console: false */
/* globals module: false */
/* globals process: false */
var create = function(rabbitChannel,queOptions,topics,exchange,queueName){
  var queue = false;
  return Promise.all([])
  .then(function(){
    return rabbitChannel.assertQueue(queueName, queOptions);
  })
  .then(function(qok){
    queue = qok.queue;
    return Promise.all(topics.map(function(topic) {
      rabbitChannel.bindQueue(queue, exchange, topic);
    }));
  })
  .then(function(){
    return {channel:rabbitChannel,que:queue};
  });
};


module.exports.init = function(rabbitChannel,config){
  return create(rabbitChannel,config.queOptions,config.topics,config.exchange,config.queueName);
};