/* globals console: false */
/* globals module: false */
/* globals Buffer: false */
/* globals setTimeout: false */
/* globals clearTimeout: false */
var done = function(msg){
  this.activeItems--;
  var me = this;
  Promise.all([])
  .then(function(){
    //it may have called reject but then resolve does not do anything
    clearTimeout(me.buffer[msg.properties.messageId].timeout);
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
  this.currentNumber++;
  if(this.currentNumber>this.buffer.length){
    this.currentNumber=0;
  }
  return this.currentNumber;
};
var PStoPromise = function(request,respond,bufferFullChannel,bufferSize
    ,exchange,publishSettings,expiration,requestTo){
  this.request=request;
  this.respond=respond;
  this.buffer = new Array(bufferSize);
  this.activeItems=0;
  this.bufferFullChannel = bufferFullChannel;
  this.exchange=exchange;
  this.publishSettings = publishSettings;
  this.expiration=expiration;
  this.currentNumber=-1;
  this.requestTo=requestTo;
};
PStoPromise.prototype.prepareConsume = function(consumeSettings){
  var me = this,
  callback = function(msg){
    return done.call(me,msg);
  };
  return this.respond.channel.consume(this.respond.que, callback, consumeSettings);
};
PStoPromise.prototype.doIt = function(obj){
  var me = this;
  return new Promise(function(resolve,reject){
    //@todo: keep track of undone request and when it reaches 50% of this.buffer.length publish to this.bufferFullChannel
    var index = nextNumber.call(me),
    timeout,
    options = Object.create(me.publishSettings);
    options.messageId=index+'';
    var pub = me.request.channel.publish(
      me.exchange,me.requestTo,new Buffer(JSON.stringify(obj)),options
    );
    if(!pub){reject('Publish returned false, channel write buffer must be full.');return;}
    timeout = setTimeout(function(){
      reject('Expiration time exceeded.');
    },me.expiration);
    me.buffer[index]={resolve:resolve,reject:reject,timeout:timeout};
    me.activeItems++;
  });
};

module.exports.init = function(request,respond,bufferFullChannel,config){
  var psToP = new PStoPromise(request,respond,bufferFullChannel,config.bufferSize
    ,config.exchange,config.publishSettings,config.expiration,config.requestTo);
  return Promise.all([])
  .then(function(){
    return psToP.prepareConsume(config.consumeSettings);
  })
  .then(function(){
    return psToP;
  });
};
