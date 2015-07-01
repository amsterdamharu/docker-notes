console.log('including authprovider')
//@todo: only set up passport, leave the routes to a route dep that depends on authImplementor
function init(express,passport,passportLocal,bodyParser,cookieParser,session,rds,
    authImplementor,config){
  console.log('init of authprovider')
  var p = new Promise(
    function(resolve,reject){
      try{
          var RedisStore = rds(session),
          redis_host = config.REDIS_HOST,
          redis_port = config.REDIS_PORT,
          app        = express(),
    		  secret = config.SESSION_SECRET;
    		  console.log('redis connection:',redis_host,':',redis_port);
      		app.use(bodyParser.urlencoded({extended:false}));
      		app.use(cookieParser());
      		app.use(session({
      			secret:secret,
      			store: new RedisStore({
      				host:redis_host,
      				port:redis_port
      			}),
      			resave:false,
      			saveUninitialized:false
      		}));
      		app.use(passport.initialize());
      		app.use(passport.session());
    		  passport.use(new passportLocal.Strategy(authImplementor.verifyCredentials));
          passport.serializeUser(authImplementor.serializeUser);
          passport.deserializeUser(authImplementor.deserializeUser);
          console.log('setting up an app post ...')
          app.post('/login',passport.authenticate('local'),function(req,res){
            res.redirect('/');
          });
          app.get('/logout',function(req,res){
            req.logout();
            res.redirect('/');
          });
          app.use(express.static('static'));
          //host root with user name
          app.get('/', function(req,res){
          	var user = req.user && req.user.name;
          	res.send('---'+user+'--- <a href="/logout>logout</a>');
          });
          
          app.listen(config.PORT, function() {
          	console.log('http://localhost:'+config.PORT);
          });
          console.log('is it the order....')
      		resolve(passport);
        }catch(err){
          reject(err);
        }
    }
  );
  return p;
}
module.exports ={init:init};