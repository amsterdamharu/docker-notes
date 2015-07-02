/* globals console: false */
/* globals module: false */
module.exports.init = function(bcrypt,db,config){
  return Promise.all([])
  .then(function(){
    var USER_COLLECTION = config.USER_COLLECTION,
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
    verifyCredentials = function(username,password,done){
      db.findOne(USER_COLLECTION,{name:username})
      .then(function(data){
        if(!data.length){
          done(null,null);return;
        }
        checkPassword(data[0].password, password)
        .then(function(result){
          if(result===true){
            done(null, { id: data[0]._id, name: data[0].name });return;
          }
          done(null,null);
        },function reject(err){
          console.log('Error in authImplementor.verifyCredentials checkPassword:'
            ,err);
          done(err,null);
        });
      },function reject(err){
        console.log('Error in authImplementor.verifyCredentials mongoFind:',err);
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
    };
    return {
      verifyCredentials:verifyCredentials,
      serializeUser:serializeUser,
      deserializeUser:deserializeUser
    };
  });
};