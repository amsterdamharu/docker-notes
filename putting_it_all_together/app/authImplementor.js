/* globals console: false */
/* globals module: false */
/* globals setTimeout: false */
module.exports.init = function(bcrypt,userBuffer,config){


//  setTimeout(function(){
//    userBuffer.doIt({doWhat:'findOne',args:[{name:'harm'}]})
//    .then(function(val){
//      console.log('doIt resolved:',arguments);
//    })
//    .then(null, function(reject){
//      console.log('doIt failed:',reject);
//    });
//  },200);

  
  
  return Promise.all([])
  .then(function(){
    var checkPassword = function(hash, password){
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
      return userBuffer.doIt({doWhat:'findOne',args:[{name:'harm'}]})
      .then(function(data){
        data = JSON.parse(data);
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