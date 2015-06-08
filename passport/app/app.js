var express = require('express'),
  passport = require('passport'),
  passportLocal = require('passport-local'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  RedisStore = require('connect-redis')(session),
  bcrypt = require('bcryptjs'),
  app = express(),
  secret = process.env.SESSION_SECRET || 'hello_world',
  MongoClient = require('mongodb').MongoClient,
  users = null,
  port = process.env.PORT || 80;

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
	secret:secret,
	store: new RedisStore({
		host:'172.17.42.1',
		port:'6379'
	}),
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

function verifyCredentials(username, password, done) {
  // Pretend this is using a real database!
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
}
passport.use(new passportLocal.Strategy(verifyCredentials));
passport.serializeUser(function(user, done) {
	//save somewhere (redis)
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    // get it from somewhere
    console.log('and id is:',user);
    done(null, user);
});

function checkPassword(hash, password){
	return new Promise(function(resolve, reject){
	  bcrypt.compare(password, hash, function(err, res) {
	    if(err){
		  reject(err);return;
		}
        resolve(res);
      });
	});
};

bcrypt.genSalt(10, function(err, salt) {
    console.log('salt is:',salt);
    bcrypt.hash("harm", salt, function(err, hash) {
        console.log('hash is:',hash);
        checkPassword(hash,'harm')
        .then(function resolve(res){
		  console.log('check returned:',res);
		},function reject(err){
		  console.log('error checking password:',err);
		});
    });
});

app.use(express.static('static'));

app.get('/', function(req,res){
	var user = req.user && req.user.name;
	res.send('---'+user+'--- <a href="/logout>logout</a>');
});
app.post('/login',passport.authenticate('local'),function(req,res){
  res.redirect('/');
});
app.get('/logout',function(req,res){
  req.logout();
  res.redirect('/');
});


app.listen(port, function() {
	console.log('http://localhost:'+port);
});


function mongoFind (collection, query){
  var p = new Promise(function(resolve,reject){
    collection.find(query).toArray(function(err,results){
	  if(err){
        reject(err);return;
      }
      resolve(results);
	});
  })
  return p;
}

  MongoClient.connect('mongodb://172.17.42.1:27017/app', function(err, db) {
    if(err) throw err;

    users = db.collection('users');
//    collection.insert({a:2}, function(err, docs) {

//      collection.count(function(err, count) {
//        console.log(format("count = %s", count));
//      });

      // Locate all the entries using find
//      collection.find({name:'harm'}).toArray(function(err, results) {
//        console.dir(results);
        // Let's close the db
//        db.close();
//      });
//    });
  });
