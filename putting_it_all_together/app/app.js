var config = require('./initializer.js').get('app');
  
config.then(function resolve(deps){
})
.then(null, function reject(err){
  console.log('error:',err);
});


