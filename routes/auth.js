var express = require('express');
var router = express.Router();
var models = require('../models/models');
var bcrypt = require('bcrypt')
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var nodemailer = require('nodemailer');
var path = require('path');



router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(expressValidator());

module.exports = function(passport) {

  // GET registration page
  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  router.post('/signup', function(req, res) {
    // validation step
    req.checkBody('username', 'Email must be a valid email address').isEmail();
    var errors = req.validationErrors();
    if (errors) {
        console.log("ERRORS", errors);
        return res.render('signup', {
            error: errors,
        })
    }
    if (req.body.password!==req.body.passwordRepeat) {
      return res.render('signup', {
          error: [{msg:'Passwords do not match. Please try again.'}]
      });
    }
    var saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        var u = new models.User({
          username: req.body.username,
          password: hash
        });
        console.log("GOT IN HERE");
        u.save(function(err, user) {
          console.log('SAVED USER');
          if (err) {
            console.log(err);
            res.status(500).redirect('/register');
            return;
          }
          console.log('Registered user:', user);
          var htmlMessage = 'test';
          const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
              }
          });
          const mailOptions = {
            from: process.env.EMAIL, // sender address
            to: user.username, // list of receivers
            subject: 'This is a test email from the app!', // Subject line
            html: htmlMessage, // plaintext body alt for html
            attachments:[
              {
                filename: 'COL Form Signup.png',
                path: 'public/images/form3.png'
              }
            ]
          };
          return transporter.sendMail(mailOptions).then((error, info) => {
              if (error) {
                  return console.log('Error sending message:', error);
              }
              console.log('Message sent: %s', info.messageId);
          });
        });
      res.redirect('/form1');
    })
  });

  // GET Login page
  router.get('/login', function(req, res) {
    res.render('login');
  });

  // POST Login page
  router.post('/login', passport.authenticate('local',{
    successRedirect: '/form1',
    failureRedirect: '/login'
  }));

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
};
