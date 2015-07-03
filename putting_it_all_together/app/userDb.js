/* globals console: false */
/* globals module: false */
/* globals Buffer: false */
var UserDb = function(parent,db){
  parent.call(this,db);
};


module.exports.init = function(mongoDbHelper,request,response,config){
  return Promise.all([])
  .then(function(){
    UserDb.prototype = Object.create(mongoDbHelper.constructor.prototype);
    UserDb.prototype.constructor = UserDb;
    UserDb.prototype.findOne = (function(findOneFn,collection){
      return function(query){
        return findOneFn.call(this,collection,query);
      };
    }(mongoDbHelper.constructor.prototype.findOne,config.USER_COLLECTION));
    var userDb = new UserDb(mongoDbHelper.constructor,mongoDbHelper.db);
    var callback = (function(config,response,userDb){
      return function(msg){
        Promise.all([])
        .then(function(){
          var strMsg = msg.content.toString();
          var data = JSON.parse(strMsg);
          return userDb[data.doWhat].apply(userDb,data.args);
        })
        .then(function(resolve){
          var settings = Object.create(config.publishSettings);
          settings.messageId=msg.properties.messageId;
          var pub = response.channel.publish(
            config.exchange,config.responseTo,new Buffer(JSON.stringify(resolve)),settings
          );
          if(!pub){
            return Promise.reject('Trying to publish but cannot');
          }          
        })
        .then(null,function(reject){
          //@todo: publish to error queue
          console.log('userDb callback called but rejected:',reject);
        });
      };
    }(config,response,userDb));
    //listen to requests and respond to it
    request.channel.consume(request.que, callback, config.consumeSettings)
    .then(null,function(){
      console.log('Could not consume user que');
      //@todo: have to publish to error queue
    });
    return userDb;
  });
};
