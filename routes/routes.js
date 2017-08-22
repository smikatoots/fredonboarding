var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var pdf = require('pdfkit');
var fs = require('fs');
var blobstream = require('blob-stream');
var nodemailer = require('nodemailer');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(expressValidator());

router.get('/', function(req, res, next) {
  res.render('home');
});

router.get('/form1', function(req, res, next) {
  res.render('form1');
});

router.post('/form1', function(req, res, next) {
  req.checkBody('primaryFirstName', 'First name must not be empty').notEmpty();
  //primaryMiddleName
  req.checkBody('primaryLastName', 'Last name must not be empty').notEmpty();
  req.checkBody('primaryTin', 'TIN # must not be empty').notEmpty();
  req.checkBody('primaryDateOfBirth', 'Date of birth must not be empty').notEmpty();
  //primaryGender
  req.checkBody('primaryCivilStatus', 'Civil status must not be empty').notEmpty();
  req.checkBody('primaryNumberAndStreet', 'Number and street address must not be empty').notEmpty();
  req.checkBody('primarySubdivision', 'Barangay and subdivision must not be empty').notEmpty();
  req.checkBody('primaryCityAndProvince', 'City and province must not be empty').notEmpty();
  req.checkBody('primaryZipcode', 'Zipcode must not be empty').notEmpty();
  req.checkBody('primaryTownAndDistrict', 'Town and district must not be empty').notEmpty();
  req.checkBody('primaryContact', 'Contact number must not be empty').notEmpty();
  req.checkBody('primaryEmail', 'Email must not be empty').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
      console.log(errors);
      res.render('form1', {
        error: errors,
        primaryFirstName: req.body.primaryFirstName,
        primaryMiddleName: req.body.primaryMiddleName,
        primaryLastName: req.body.primaryLastName,
        primaryTin: req.body.primaryTin,
        primaryDateOfBirth: req.body.primaryDateOfBirth,
        primaryCivilStatus: req.body.primaryCivilStatus,
        primaryNumberAndStreet: req.body.primaryNumberAndStreet,
        primarySubdivision: req.body.primarySubdivision,
        primaryCityAndProvince: req.body.primaryCityAndProvince,
        primaryZipcode: req.body.primaryZipcode,
        primaryTownAndDistrict: req.body.primaryTownAndDistrict,
        primaryContact: req.body.primaryContact,
        primaryEmail: req.body.primaryEmail,
      });
  } else {
      new User({
          primaryFirstName: req.body.primaryFirstName,
          primaryMiddleName: req.body.primaryMiddleName,
          primaryLastName: req.body.primaryLastName,
          primaryGender: req.body.primaryGender,
          primaryTin: req.body.primaryTin,
          primarySSS: req.body.primarySSS,
          primaryDateOfBirth: req.body.primaryDateOfBirth,
          primaryCivilStatus: req.body.primaryCivilStatus,
          primaryNumberAndStreet: req.body.primaryNumberAndStreet,
          primarySubdivision: req.body.primarySubdivision,
          primaryCityAndProvince: req.body.primaryCityAndProvince,
          primaryZipcode: req.body.primaryZipcode,
          primaryTownAndDistrict: req.body.primaryTownAndDistrict,
          primaryContact: req.body.primaryContact,
          primaryEmail: req.body.primaryEmail,
      }).save((err, user) => {
          if (err) {
              console.log("Oh no, error in saving user:", err);
          } else {
              console.log("User successfully saved:", user);
              localStorage.setItem('userId', user._id)
              res.redirect('/verify');
          }
      })
  }
});

router.get('/form2', function(req, res, next) {
  res.render('form2');
});

router.get('/form3', function(req, res, next) {
  res.render('form3');
});


router.get('/verify', function(req, res, next) {
    var id = localStorage.getItem('userId');
    User.findById(id)
    .exec((err, user) => {
          if (err) {
              console.log('Error in finding user', err)
          } else {
              console.log('Found user from /verify get route', user);
              return user
          }
    })
    .then((user) => {
        res.render('verify', {
            user
        })
    })
})

router.post('/verify', function(req, res, next) {
  var id = localStorage.getItem('userId');
  User.findById(id)
  .exec((err, user) => {
        if (err) {
            console.log('Error in finding user', err)
        } else {
            console.log('Found user in /post verify', user);
            return user
        }
  })
  .then((user) => {
        console.log('User found', tempId, user);
        var string = 'This is test user data: ' + user.primaryFirstName + user.primaryLastName + user.primaryEmail;
        var doc = new pdf();
        var buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            var pdfData = Buffer.concat(buffers);
            var mailTransport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                   user: 'smikatoots@gmail.com',
                   pass: 'newspaper'
                }
            });
            var mailOptions = {
                  from: 'smikatoots@gmail.com', // sender address
                  to: 'reyes.mikaelahelene@gmail.com', // list of receivers
                  subject: 'This is a test email from the app!', // Subject line
                  html: "Hello dad, <br/> I wanted to test if this worked. <br/> Best, <br/>Mika", // plaintext body alt for html
                  attachments:[{
                      filename: "testdocument.pdf",
                      content: pdfData
                  }]
            };
            return mailTransport.sendMail(mailOptions).then(() => {
                console.log('Email sent!');
            }).catch(error => {
                console.log('Error:', error);
            });
        })
        doc.text(string, 100, 100);
        doc.end();
        res.redirect('/form3');
    })
});

module.exports = router;
