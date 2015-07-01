//@todo move db stuff out of this module
module.exports.init = function(bcrypt,config){
  return Promise.all([])
  .then(function(){
    var users = null,
    mongodb_host = config.MONGODB_HOST,
    mongodb_port = config.MONGODB_PORT,
    mongodb_db   = config.MONGODB_DB,
    checkPassword = function(hash, password){
      return new Promise(function(resolve, reject){
        bcrypt.compare(password, hash, function(err, res) {
          if(err){
            reject(err);return;
          }
          resolve(res);
        });
      });
    },
    mongoFind=function(collection, query){
      var p = new Promise(function(resolve,reject){
        collection.find(query).toArray(function(err,results){
      	  if(err){
            reject(err);return;
          }
          resolve(results);
      	});
      });
      return p;
    },
    verifyCredentials = function(username,password,done){
      mongoFind(users,{name:username})
      .then(function resolve(data){
        if(!data.length){
          done(null,null);return;
        }
        checkPassword(data[0].password, password)
        .then(function resolve (result){
          if(result===true){
            done(null, { id: data[0]._id, name: data[0].name });return;
          }
          done(null,null);
        },function reject(err){
          console.log('we have an error:',err);
            done(err,null);
        });
      },function reject(err){
        console.log('an error:',err);
        done(err,null);
  	  });
    },
    serializeUser = function(user, done) {
      //save somewhere (redis)
      done(null, user);
    },
    deserializeUser = function(user, done) {
      // get it from somewhere
      done(null, user);
    },
    MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://'+mongodb_host+':'+
        mongodb_port+'/'+
        mongodb_db, function(err, db) {
      if(err) throw err;
      users = db.collection('users');
    });
    console.log('----mongodb conection:','mongodb://'+mongodb_host+':'+
        mongodb_port+'/'+
        mongodb_db);
    return {
      verifyCredentials:verifyCredentials,
      serializeUser:serializeUser,
      deserializeUser:deserializeUser
    }    
  })
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
