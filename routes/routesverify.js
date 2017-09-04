var express = require('express');
var router = express.Router();
var models = require('../models/models');

var User = models.User;
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(expressValidator());

router.get('/verify', function(req, res, next) {
    var user = req.user;
    User.findById(user._id)
    .exec((err, user) => {
          if (err) {
              console.log('Error in finding user', err)
          } else {
              console.log('Found user from /verify get route', user);
              return user
          }
    })
    .then((user) => {
        console.log('USERS', user);
        res.render('verify', {
            user
        })
    })
})

router.post('/verify', function(req, res, next) {
  var user = req.user;
  User.findById(user._id)
  .exec((err, user) => {
        if (err) {
            console.log('No user yet', err)
        } else {
            console.log('Found user in /post verify', user);
            return user
        }
  })
  .then((user) => {
      var string = `${user.primaryFirstName} ${user.primaryMiddleName} ${user.primaryLastName} is cool. Yes or no?
      Please email your answers to ${user.username}. Thanks, yo.`
      var htmlMessage = `<h4>Hi ${user.primaryFirstName}!</h4>
      <p>Thank you for signing up for your COL Account.<br><br>
      Please do the following: <br>
      1) Save all your documents to your files. <br>
      2) Print out the "[[DOCUMENT]]", print it and affix your signature in the appropriate fields. <br>
      3) Scan that document and send it back to this freddiereyes@gmail.com <br>
      We look forward to receiving your documents!</p><br>
      <h4>Best, <br> Freddie Reyes</h4>`
      var doc = new pdf();
      var buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
          var pdfData = Buffer.concat(buffers);
          const mailTransport = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                 user: 'smikatoots@gmail.com',
                 pass: 'newspaper'
              }
          });
          const mailOptions = {
                from: 'smikatoots@gmail.com', // sender address
                to: user.username, // list of receivers
                subject: 'This is a test email from the app!', // Subject line
                html: htmlMessage, // plaintext body alt for html
                attachments:[{
                    filename: "COL Document.pdf",
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
