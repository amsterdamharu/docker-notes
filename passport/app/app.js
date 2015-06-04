var express = require('express'),
  passport = require('passport'),
  passportLocal = require('passport-local'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  app = express(),
  secret = process.env.SESSION_SECRET || 'hello_world',
  port = process.env.PORT || 80;

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
	secret:secret,
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

function verifyCredentials(username, password, done) {
    // Pretend this is using a real database!
    if (true) {
        done(null, { id: username, name: username });
    } else {
        done(null, null);
    }
}
passport.use(new passportLocal.Strategy(verifyCredentials));
passport.serializeUser(function(user, done) {
	//save somewhere (redis)
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    // get it from somewhere
    done(null, { id: id, name: 'harm' });
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
