/* globals console: false */
/* globals module: false */
/* globals require: false */
/* globals setTimeout: false */
/* globals Buffer: false */
var config = require('./initializer.js').get('userDb');

config.then(function resolve(deps){
})
.then(null, function reject(err){
  console.log('Error in config get:',err);
});


