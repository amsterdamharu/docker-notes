/* globals console: false */
/* globals module: false */
/* globals Buffer: false */
var MongoDbHelper = function(db){
  this.db = db;
};
MongoDbHelper.prototype.findOne=function(collection,query){
  var me = this;
  //always return a promise, even when an error is thrown
  return Promise.all([])
  .then(function(){
    var p = new Promise(function(resolve,reject){
      var col = me.db.collection(collection);
      col.find(query).toArray(function(err,results){
    	  if(err){
          reject(err);return;
        }
        resolve(results);
    	});
    });
  	return p;
  });
};


module.exports.init = function(mongodb,config){
  return Promise.all([])
  .then(function(){
    return new Promise(function(resolve,reject){
      var mongodb_host = config.MONGODB_HOST,
      mongodb_port = config.MONGODB_PORT,
      mongodb_db   = config.MONGODB_DB,
      mongoClient;
      mongoClient = mongodb.MongoClient;
      mongoClient.connect('mongodb://'+mongodb_host+':'+
          mongodb_port+'/'+
          mongodb_db, function(err, db) {
        if(err) {reject(err);}
        console.log('----mongodb conection:','mongodb://'+mongodb_host+':'+
          mongodb_port+'/'+
          mongodb_db);
        resolve(new MongoDbHelper(db));
      });      
    });
  });
};



//no need for this code:
//  bcrypt.genSalt(10, function(err, salt) {
//      console.log('salt is:',salt);
//      bcrypt.hash("harm", salt, function(err, hash) {
//          console.log('hash is:',hash);
//          checkPassword(hash,'harm')
//          .then(function resolve(res){
//  		  console.log('check returned:',res);
//  		},function reject(err){
//  		  console.log('error checking password:',err);
//  		});
//      });
//  });
