//initialize app
var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var session = require("express-session")
var fs = require("fs")

if (fs.existsSync("./env.js")){
 console.log("env.js loaded locally")
 var env = require("./env");
}
else {
 var env = process.env;
}

// Load Passport and Github Strategy
var passport = require("passport")
var GitHubStrategy = require("passport-github").Strategy
var DB = require("./config/connection")
var User = DB.models.User;

passport.serializeUser(function(user, done) {
  done(null, user)
})
passport.deserializeUser(function(obj, done) {
  done(null, obj)
})

app.use(bodyParser.json());
app.set("view engine","hbs");
app.use(bodyParser.urlencoded({ extended: false }));

// Configure Passport
passport.use(new GitHubStrategy({
    clientID: env.clientID,
    clientSecret: env.clientSecret,
    callbackURL: env.callbackURL
  },
  function(accessToken, refreshToken, aProfile, done) {
    token = accessToken;
    tokenSecret = refreshToken;
    profile = aProfile;

    User.findOrCreate({where: {
      githubId: profile.id,
      username: profile.displayName
    }})
    .then(function(user){
      return done(null, user);
    })

 }
));
app.use(session({
  secret: 'keyboard cat', // could also move session secret to env.js
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())

var postsController = require("./app/controllers/posts");
var commentsController = require("./app/controllers/comments");
var usersController = require("./app/controllers/users");

// serve public assets
app.use(express.static("public"));

//load hbs file
app.get("/", function(req, res){
  res.render("index",{user: req.user});
});

// Routes
app.use("/", postsController);
app.use("/", commentsController);
app.use("/", usersController);

app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){}); // i think you can remove this function callback, as it's never invoked anyway

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.token = token;
    req.session.tokenSecret = tokenSecret;
    req.session.profile = profile;
    res.redirect('/');
  });

  app.get('/currentUserData', function(req, res) {
  // this is a really clever implementation! will be keeping an eye out for how to hack this
  // i.e. can savvy web developers fake being some other user?
    console.log(req.user);
    if (req.user === undefined) { // or if(req.user)
        // The user is not logged in
        res.json({ });
    } else {
        res.json( req.user );
    }
});


app.get('/signout', function(req, res){
  console.log(req.user);
  req.session.destroy();
  console.log(req.user); //nice for debugging, be sure to remove console logs
  res.redirect("/");
})

// I dont see any thing on the back end preventing users from creating
// new posts or comments.
// consider having another `app.use` that restricts routes.

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
  console.log("Listening on port", app.get('port'));
});
