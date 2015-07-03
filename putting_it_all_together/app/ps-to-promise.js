/* globals console: false */
/* globals module: false */
/* globals Buffer: false */
var currentNumber=0;
var done = function(msg){
  var me = this;
  //@todo: check if a timeout was exceeded, if so then reject it.
  Promise.all([])
  .then(function(){
    me.buffer[msg.properties.messageId].resolve(msg.content.toString());
    me.buffer[msg.properties.messageId]=false;
  })
  .then(null,function(reject){
    //@todo: why would it be rejected, if there was an error then publish it
  });
  //@todo: ack not implemented yet
  //this.pubsub.channel.ack(msg);
};
var nextNumber = function(){
  currentNumber++;
  if(currentNumber>this.buffer.length){
    currentNumber=0;
  }
  return currentNumber;
};
var PStoPromise = function(pubsub,bufferFullChannel,bufferSize,exchange,publishSettings){
  this.pubsub=pubsub;
  this.buffer = new Array(bufferSize);
  this.bufferFullChannel = bufferFullChannel;
  this.exchange=exchange;
  this.publishSettings = publishSettings;
};
PStoPromise.prototype.prepareConsume = function(consumeSettings){
  var me = this,
  callback = function(msg){
    return done.call(me,msg);
  };
  return this.pubsub.channel.consume(this.pubsub.que, callback, consumeSettings);
};
PStoPromise.prototype.doIt = function(topic,obj){
  var me = this;
  return new Promise(function(resolve,reject){
    //@todo: set a timeout to fail this, pass it to rabbit so it will remove if timeout is exceeded
    //@todo: keep track of undone request and when it reaches 50% of this.buffer.length publish to this.bufferFullChannel
    var index = nextNumber.call(me),
    options = Object.create(me.publishSettings);
    options.messageId=index+'';
    var pub = me.pubsub.channel.publish(
      me.exchange,topic,new Buffer(JSON.stringify(obj)),options
    );
    if(!pub){reject('Publish returned false, channel write buffer must be full.');return;}
    me.buffer[index]={resolve:resolve,reject:reject};
  });
};

module.exports.init = function(pubsub,bufferFullChannel,config){
  var psToP = new PStoPromise(pubsub,bufferFullChannel,config.bufferSize,config.exchange,config.publishSettings);
  return Promise.all([])
  .then(function(){
    return psToP.prepareConsume(config.consumeSettings);
  })
  .then(function(){
    return psToP;
  });
};
