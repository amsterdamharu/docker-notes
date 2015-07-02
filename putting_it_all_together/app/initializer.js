/* globals console: false */
/* globals module: false */
/* globals require: false */
var Config = function(){
  var USER_COLLECTION = 'users';
  this.app = {
    init:false,
    config:{
      exchange:'userCollection'      
    },
    deps:['authProvider','userQue']
  };
  this.authProvider = {
    init:true,
    require:'./authProvider.js',
    config:{
      PORT:80,
      REDIS_HOST:'redis',
      REDIS_PORT:'6379',
      SESSION_SECRET:'lkijOKJkjhsdffU833230998REFGCBVlkjimncldsuQWSSZXXCCFppolk'
    },
    deps:['express','passport','passportLocal','bodyParser',
      'cookieParser','session','redisStore',
      'authImplementor']
  };
  this.authImplementor = {
    init:true,
    require:'./authImplementor.js',
    config:{
      USER_COLLECTION:USER_COLLECTION
    },
    deps:['bcrypt','db']
  };
  this.db ={
    init:true,
    require:'./db.js',
    config:{
      MONGODB_HOST:'mongodb',
      MONGODB_PORT:'27017',
      MONGODB_DB:'app'
    },
    deps:['mongodb']
  };
  this.userQue ={
    init:true,
    require:'./rabbitQue.js',
    config:{
      exchange:'userCollection',
      queOptions:{exclusive:false},
      topics:['warning','error']
    },
    deps:['userChannel']
  };
  this.userChannel ={
    init:true,
    require:'./rabbitChannel.js',
    config:{
      user:'harm',
      password:'harm',
      host:'rabbitmq',
      exchange:'userCollection',
      exchangeType:'topic',
      exchangeOptions:{durable: false}
    },
    deps:['amqplib']
  };
  this.express={
    init:false,
    require:'express',
    config:{},
    deps:[]
  };
  this.passport={
    init:false,
    require:'passport',
    config:{},
    deps:[]
  };
  this.passportLocal={
    init:false,
    require:'passport-local',
    config:{},
    deps:[]    
  };
  this.bodyParser={
    init:false,
    require:'body-parser',
    config:{},
    deps:[]    
  };
  this.cookieParser={
    init:false,
    require:'cookie-parser',
    config:{},
    deps:[]    
  };
  this.session={
    init:false,
    require:'express-session',
    config:{},
    deps:[]    
  };
  this.redisStore={
    init:false,
    require:'connect-redis',
    config:{},
    deps:[]    
  };
  this.bcrypt={
    init:false,
    require:'bcryptjs',
    config:{},
    deps:[]    
  };
  this.mongodb={
    init:false,
    require:'mongodb',
    config:{},
    deps:[]    
  };
  this.amqplib={
    init:false,
    require:'amqplib',
    config:{},
    deps:[]
  };
};

//@todo: put in a seperate tools file
function getByKeyArray(keys,obj){
  var i = -1,
  len=keys.length,
  err = {error:true},
  ret=obj;
  if(typeof obj==='undefined'){
    return err;
  }
  while(++i<len){
    ret=ret[keys[i]];
    if(typeof ret === 'undefined'){
      break;
    }
  }
  if(i!==len){
    return err;
  }
  return {
    error:false,
    item:ret
  };
}
function getByKey(keyString,obj){
  keyString = keyString || '';
  var keyArray = (keyString==='')?[]:keyString.split('.');
  return getByKeyArray(keyArray,obj);
}
function getByKeyThrow(keyString,obj){
  var ret = getByKey(keyString,obj);
  if(ret.error){
    throw new Error('Cannot get config for key:',keyString);
  }
  return ret.item;
}

function getConfig(){
  //@todo: return the config from a https server using basic auth
  return new Promise(function(resolve){
    resolve(new Config());
  });
}

var loadedMods = {};
function loadMod(config,key,rootConfig){
  if(loadedMods[key]){
    return loadedMods[key];
  }
  return Promise.all([])
  .then(function(){
    var promises = [],
      deps = config.deps,
      depConfig=false,
      i=-1,len=config.deps.length;
    while(++i<len){
      if(loadedMods[key]){
        promises.push(loadedMods[key]);
      }else{
        depConfig = getByKeyThrow(deps[i], rootConfig);
        promises.push(
          loadMod(
            depConfig,deps[i],rootConfig
          )
        );
      }
    }
    return Promise.all(promises);    
  })
  .then(function(deps){
    var mod = false,i=-1,len=deps.length;
    if(config.require){
      mod = require(config.require);
    }else{
      mod={};
      while(++i<len){
        mod[config.deps[i]]=deps[i];
      }
      mod.config=config.config;
    }
    deps.push(config.config);
    if(config.init){
      mod=mod.init.apply(null,deps);
    }
    loadedMods[key]=mod;
    return mod;
  });
}
module.exports.get = function(key){
  return getConfig()
  .then(function(config){
    var modConfig = getByKeyThrow(key, config);
    return loadMod(modConfig, key, config);
  });
};