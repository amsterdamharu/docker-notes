/* globals console: false */
/* globals module: false */
/* globals require: false */
var config = require('./initializer.js').get('app');
  
config.then(function resolve(deps){
  return deps.rabbitQue.create(
    'harm','harm','rabbitmq','mytest','topic',{durable: false},{exclusive:false},['warning','error']
  )
  .then(function(rabbit){
    
    
    setTimeout(function(){
      function logMessage(msg) {
        console.log(" Da subscriber received %s:'%s'",
                    msg.fields.routingKey,
                    msg.content.toString());
      }
      return rabbit.channel.consume(rabbit.que, logMessage, {noAck: true});      
    },100);
    setTimeout(function(){
      deps.rabbitChannel.create(
        'harm','harm','rabbitmq','mytest','topic',{durable: false},{exclusive:true},['warning','error']
      ).then(function(channel){
        console.log('time to publish something...');
        channel.publish('mytest','warning',new Buffer("Whaddup friend?"));
        channel.publish('mytest','error',new Buffer("Whaddup friend?"));
        channel.publish('mytest','nothing',new Buffer("Whaddup friend?"));
        channel.close();
      });
    },500);
  })
  .then(null,function(err){
    console.log('Error getting que or channel:',err);
    return Promise.reject(err);
  });
})
.then(null, function reject(err){
  console.log('Error in config get:',err);
});


