var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var pdf = require('pdfkit');
var fs = require('fs');
var blobStream = require('blob-stream');
var nodemailer = require('nodemailer');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var apiKey = process.env.MAILGUN_API_KEY;
var domain = 'sandbox1ae78e42a088407688d3f0069f7828d5.mailgun.org';
var mailgunJS = require('mailgun-js');
var mailgun = new mailgunJS({ apiKey, domain });
var fs = require('fs');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(expressValidator());

router.get('/', function(req, res, next) {
  res.render('home');
});

router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

var form1 = require('./routesform1.js')
var verify = require('./routesverify.js')

router.use('/', form1);
router.use('/', verify);

router.get('/form2', function(req, res, next) {
  res.render('form2');
});

router.get('/confirm', function(req, res, next) {
    res.render('/confirm')
})

router.get('/form3', function(req, res, next) {
  res.render('form3');
});

module.exports = router;
