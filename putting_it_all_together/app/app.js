/* globals console: false */
/* globals module: false */
/* globals require: false */
/* globals setTimeout: false */
/* globals Buffer: false */
var config = require('./initializer.js').get('app');
  
config.then(function resolve(deps){
  setTimeout(function(){
    function logMessage(msg) {
      console.log(" Da subscriber received %s:'%s'",
                  msg.fields.routingKey,
                  msg.content.toString());
    }
    return deps.userQue.channel.consume(deps.userQue.que, logMessage, {noAck: true});      
  },100);
  setTimeout(function(){
    console.log('time to publish something...');
    deps.userQue.channel.publish(deps.config.exchange,'warning',new Buffer("Whaddup friend?"));
    deps.userQue.channel.publish(deps.config.exchange,'error',new Buffer("Whaddup friend?"));
    deps.userQue.channel.publish(deps.config.exchange,'nothing',new Buffer("Whaddup friend?"));
  },500);
})
.then(null, function reject(err){
  console.log('Error in config get:',err);
});


