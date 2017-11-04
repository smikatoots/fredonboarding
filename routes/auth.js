var express = require('express');
var router = express.Router();
var models = require('../models/models');
var bcrypt = require('bcrypt')
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var nodemailer = require('nodemailer');
var path = require('path');
var User = models.User;
var fs = require('fs');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(expressValidator());

var mailgun = require("mailgun-js");
var api_key = process.env.MAILGUN_API_KEY;
var domain = process.env.DOMAIN;
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

module.exports = function(passport) {

  // GET registration page
  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  router.post('/signup', function(req, res) {
    // validation step
    req.checkBody('username', 'Email must be a valid email address').isEmail();
    req.checkBody('primaryFirstName', 'First name must not be empty').notEmpty();
    req.checkBody('primaryLastName', 'Last name must not be empty').notEmpty();

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

    User.find({username: req.body.username})
    .exec((err, user) => {
      if (user[0] !== undefined) {
          console.log('User already exists. Please try again.')
          return res.render('signup', {
            error: [{msg: 'The email address is already in use. Please try again.'}]
          })
      } else if (err){
          console.log('Error:', err);
          return
      } else {
        var saltRounds = 10;
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            var u = new models.User({
              username: req.body.username,
              password: hash,
              primaryFirstName: req.body.primaryFirstName,
              primaryLastName: req.body.primaryLastName,
            });
            u.save(function(err, user) {
              if (err) {
                console.log(err);
                res.status(500).redirect('/register');
                return;
              }
              console.log('Registered user:', user);
              var htmlMessage = `<h4>Hi ${user.primaryFirstName}!</h4>
              <p>Thank you for signing up for your COL Account.<br><br>
              Here is your information for your account:<br>
              <b>Full Name:</b> ${req.body.primaryFirstName} ${req.body.primaryLastName}<br>
              <b>Username:</b> ${req.body.username} <br>
              <b>Password:</b> ${req.body.password} <br><br>
              To continue your application you may do any of the following: <br>
              <ul>
              <li>Download, print and fill out the forms attached. After filling them out, scan them and email to ${process.env.MAIN_EMAIL}</li>
              <li>Click on <a href="http://fredonboarding.herokuapp.com">this link </a>to continue with your online application using your email and password.</li>
              </ul><br>
              Please email Freddie Reyes with any questions. We look forward to receiving your documents!</p>
              <h4>Best, <br>
              Freddie Reyes <br>
              ${process.env.MAIN_EMAIL}</h4><br>
              <p>2403B East Tower, <br>
              Philippine Stock Exchange Center, <br>
              Exchange Rd. Ortigas Center, <br>
              Pasig City 1605 Philippines</p>
              `
              const mailOptions = {
                from: 'Freddie Reyes from COL Financial <' + process.env.MAIN_EMAIL + '>', // sender address
                to: [user.username], // list of receivers
                subject: 'Your Citisec Online Financial Application', // Subject line
                html: htmlMessage, // plaintext body alt for html
                attachment: [
                  new mailgun.Attachment({data: fs.readFileSync(path.resolve(__dirname, '../public/images/full-form.pdf')), filename: 'COL Form.pdf'}),
                ]
              };
              return mailgun.messages().send(mailOptions, function(err, body) {
                if (err) {
                    console.log('Error:', err);
                } else {
                  console.log(mailOptions);
                  console.log('Email sent via mailgun', body);
                }
              })
            });
          res.redirect('/confirm-signup');
        })
      }
    })
  });

  router.get('/confirm-signup', function(req, res) {
    res.render('confirm-signup');
  });

  // GET Login page
  router.get('/login', function(req, res) {
    res.render('login');
  });

  // GET Login error page
  router.get('/loginerror', function(req, res) {
    res.render('login', {
      error: 'Invalid username or password. Please try again.'
    });
  });

  // POST Login page
  router.post('/login', passport.authenticate('local',{
    successRedirect: '/form0',
    failureRedirect: '/loginerror'
  }));

  router.post('/loginerror', passport.authenticate('local',{
    successRedirect: '/form0',
    failureRedirect: '/loginerror'
  }));

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
};
