var express = require('express');
var router = express.Router();
var models = require('../models/models');
var pdf = require('pdfkit');
var nodemailer = require('nodemailer');
var path = require('path');



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
            user: user
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
      var htmlMessage = `<h4>Hi ${user.primaryFirstName}!</h4>
      <p>Thank you for signing up for your COL Account.<br><br>
      Please do the following: <br>
      1) Save all your documents to your files. <br>
      2) Print out the "[insert name of document here]" and affix your signature in the appropriate fields. <br>
      3) Scan that document and send it back to freddiereyes@gmail.com <br>><br>
      We look forward to receiving your documents!</p
      <h4>Best, <br> Freddie Reyes</h4>`
      var doc = new pdf();
      var buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
          var pdfData = Buffer.concat(buffers);
          const mailTransport = nodemailer.createTransport({
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
      });

      // Form Background
      doc.image('public/images/form1-clean.png', 0, 0, {
          width: 610
      });

      doc.fontSize(10);

      var primaryBaseWidth = 140;
      var secondaryBaseWidth = 368;
      var nameHeight = 180;
      var nameHeightIncrement = 20;

      // primary names
      doc.text(`${user.primaryLastName}`, primaryBaseWidth, nameHeight);
      doc.text(`${user.primaryFirstName}`, primaryBaseWidth, nameHeight + (nameHeightIncrement*1));
      doc.text(`${user.primaryMiddleName}`, primaryBaseWidth, nameHeight + (nameHeightIncrement*2));
      // secondary names
      doc.text(`secondary last name`, secondaryBaseWidth, nameHeight);
      doc.text(`secondary first name`, secondaryBaseWidth, nameHeight + (nameHeightIncrement*1));
      doc.text(`secondary middle name`, secondaryBaseWidth, nameHeight + (nameHeightIncrement*2));

      var tinHeight = 221;
      var tinHeightIncrement = 17;

      // primary tin and beyond
      doc.text(`${user.primaryTin}`, primaryBaseWidth, tinHeight + (tinHeightIncrement*1));
      doc.text(`${user.primarySSS}`, primaryBaseWidth, tinHeight + (tinHeightIncrement*2));
      doc.text(`${user.primaryGender}`, primaryBaseWidth, tinHeight + (tinHeightIncrement*3));
      doc.text(`${user.primaryDateOfBirth}`, primaryBaseWidth + 100, tinHeight + (tinHeightIncrement*3));
      doc.text(`${user.primaryBirthCountry}`, primaryBaseWidth, tinHeight + (tinHeightIncrement*4));
      doc.text(`${user.primaryCitizenshipCountry}`, primaryBaseWidth, tinHeight + (tinHeightIncrement*5));
      doc.text(`${user.primaryResidenceCountry}`, primaryBaseWidth, tinHeight + (tinHeightIncrement*6));

      // secondary tin and beyond
      doc.text(`${user.primaryTin}`, secondaryBaseWidth, tinHeight + (tinHeightIncrement*1));
      doc.text(`${user.primarySSS}`, secondaryBaseWidth, tinHeight + (tinHeightIncrement*2));
      doc.text(`${user.primaryGender}`, secondaryBaseWidth, tinHeight + (tinHeightIncrement*3));
      doc.text(`${user.primaryDateOfBirth}`, secondaryBaseWidth + 100, tinHeight + (tinHeightIncrement*3));
      doc.text(`${user.primaryBirthCountry}`, secondaryBaseWidth, tinHeight + (tinHeightIncrement*4));
      doc.text(`${user.primaryCitizenshipCountry}`, secondaryBaseWidth, tinHeight + (tinHeightIncrement*5));
      doc.text(`${user.primaryResidenceCountry}`, secondaryBaseWidth, tinHeight + (tinHeightIncrement*6));

      var contactHeight = 320;
      var contactHeightIncrement = 23;

      // primary contact
      doc.text(`Telephone: ${user.primaryContact}`, primaryBaseWidth, contactHeight + (contactHeightIncrement*1));
      doc.text(`Mobile: ${user.primaryContact}`, primaryBaseWidth, contactHeight + (contactHeightIncrement*2));
      doc.text(`${user.username}`, primaryBaseWidth, contactHeight + (contactHeightIncrement*3));

      // secondary contact
      doc.text(`Telephone: secondary phone`, secondaryBaseWidth, contactHeight + (contactHeightIncrement*1));
      doc.text(`Mobile: secondary mobile`, secondaryBaseWidth, contactHeight + (contactHeightIncrement*2));
      doc.text(`secondary email`, secondaryBaseWidth, contactHeight + (contactHeightIncrement*3));

      var addressHeight = 398.5;
      var addressHeightIncrement = 17;

      // primary address
      doc.text(`${user.primaryNumberAndStreet}`, primaryBaseWidth, addressHeight + (addressHeightIncrement*1));
      doc.text(`${user.primarySubdivision}`, primaryBaseWidth + 80, addressHeight + (addressHeightIncrement*1));
      doc.text(`${user.primaryCity}, ${user.primaryProvince}`, primaryBaseWidth, addressHeight + (addressHeightIncrement*2));
      doc.text(`${user.primaryZipcode}`, primaryBaseWidth + 160, addressHeight + (addressHeightIncrement*2));
      doc.text(`${user.primaryTownAndDistrict}`, primaryBaseWidth, addressHeight + (addressHeightIncrement*3));
      doc.text(`${user.primaryResidenceCountry}`, primaryBaseWidth, addressHeight + (addressHeightIncrement*4));
      doc.text(`${user.primaryCivilStatus}`, primaryBaseWidth, addressHeight + (addressHeightIncrement*5));

      // secondary address
      doc.text(`${user.primaryNumberAndStreet}`, secondaryBaseWidth, addressHeight + (addressHeightIncrement*1));
      doc.text(`${user.primarySubdivision}`, secondaryBaseWidth + 80, addressHeight + (addressHeightIncrement*1));
      doc.text(`${user.primaryCity}, ${user.primaryProvince}`, secondaryBaseWidth, addressHeight + (addressHeightIncrement*2));
      doc.text(`${user.primaryZipcode}`, secondaryBaseWidth + 160, addressHeight + (addressHeightIncrement*2));
      doc.text(`${user.primaryTownAndDistrict}`, secondaryBaseWidth, addressHeight + (addressHeightIncrement*3));
      doc.text(`${user.primaryResidenceCountry}`, secondaryBaseWidth, addressHeight + (addressHeightIncrement*4));
      doc.text(`${user.primaryCivilStatus}`, secondaryBaseWidth, addressHeight + (addressHeightIncrement*5));


      doc.end();
      res.redirect('/form3');
    })
    .catch((err) => {
        console.log(err);
    })

});

module.exports = router;
