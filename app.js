var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
// var LocalStrategy = require('passport-local');
var mongoose = require('mongoose');
// var FacebookStrategy = require('passport-facebook');
// var GoogleStrategy = require('passport-google-oauth20').Strategy;

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

var models = require('./models/models');

var routes = require('./routes/routes');
var auth = require('./routes/auth');
var app = express();

// view engine setup
var hbs = require('express-handlebars')({
  defaultLayout: 'main',
  extname: '.hbs'
});
app.engine('hbs', hbs);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// app.use(logger('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport
app.use(session({
  secret: process.env.SECRET,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));


// app.use(passport.initialize());
// app.use(passport.session());
//
// passport.serializeUser(function(user, done) {
//   done(null, user._id);
// });
//
// passport.deserializeUser(function(id, done) {
//   models.User.findById(id, done);
// });

// passport strategy
// passport.use(new LocalStrategy(function(username, password, done) {
//   // Find the user with the given username
//   models.User.findOne({ username: username }, function (err, user) {
//     // if there's an error, finish trying to authenticate (auth failed)
//     if (err) {
//       console.error('Error fetching user in LocalStrategy', err);
//       return done(err);
//     }
//     // if no user present, auth failed
//     if (!user) {
//       return done(null, false, { message: 'Incorrect username.' });
//     }
//     // if passwords do not match, auth failed
//     if (user.password !== password) {
//       return done(null, false, { message: 'Incorrect password.' });
//     }
//     // auth has has succeeded
//     return done(null, user);
//   });
// }
// ));

//oauth stuff, google + facebook
// passport.use(new FacebookStrategy({
//   clientID: process.env.FB_CLIENT_ID,
//   clientSecret: process.env.FB_CLIENT_SECRET,
//   profileFields: ['id', 'displayName', 'photos'],
//   callbackURL: process.env.NODE_ENV === 'production' ? process.env.DOMAIN + '/auth/facebook/callback' : "http://localhost:3000/auth/facebook/callback"
// },
// function(accessToken, refreshToken, profile, cb) {
//   User.findOrCreate({ facebookId: profile.id }, {
//     pictureURL: profile.photos[0].value,
//     username: profile.displayName
//   }, function (err, user) {
//     if (err) {
//       console.log('Problems with login')
//     }
//     else {
//       console.log('FB logged in!')
//       return cb(err, user);
//     }
//   });
// }
// ));

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.NODE_ENV === 'production' ? process.env.DOMAIN + '/auth/google/callback' : "http://localhost:3000/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ googleId: profile.id }, {
//       profile: profile,
//       username: profile.name.givenName + ' ' + profile.name.familyName
//     }, function (err, user) {
//       if (err) {
//         console.log('Problems with login', err)
//       }
//       else {
//         console.log('google logged in!', profile)
//         return cb(err, user);
//       }
//     });
//   }
// ));

// app.use('/', auth(passport));
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Express started. Listening on port %s', port);

module.exports = app;
