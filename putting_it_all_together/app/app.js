/* globals console: false */
/* globals module: false */
/* globals require: false */
/* globals setTimeout: false */
/* globals Buffer: false */
var config = require('./initializer.js').get('app');
  
config.then(function resolve(deps){
  deps.userBuffer.doIt('warning','----message from user buffer')
  .then(function(val){
    console.log('doIt resolved:',arguments);
  })
  .then(null, function(reject){
    console.log('doIt failed:',reject);
  });

})
.then(null, function reject(err){
  console.log('Error in config get:',err);
});


