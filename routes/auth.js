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
          ${process.env.MAIN_EMAIL}</h4>`
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
            subject: 'Your Citisec Online Application', // Subject line
            html: htmlMessage, // plaintext body alt for html
            attachments:[
              {
                filename: 'COL Form.pdf',
                path: 'public/images/full-form.pdf'
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
      res.redirect('/confirm-signup');
    })
  });

  router.get('/confirm-signup', function(req, res) {
    res.render('confirm-signup');
  });

  // GET Login page
  router.get('/login', function(req, res) {
    res.render('login');
  });

  // POST Login page
  router.post('/login', passport.authenticate('local',{
    successRedirect: '/form0',
    failureRedirect: '/login'
  }));

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
};
