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
            user: user,
            joint: user.accountType === 'joint'
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
      <p>Thank you for entering your information for your COL Account.<br><br>
      Please do the following: <br>
      1) Download all the documents attached to this email. <br>
      2) Print out "COL Form 2" and "COL Form 3", fill out the missing fields, sign and scan.<br>
      3) Scan all documents.<br>
      4) Email all three (3) pages to ${process.env.MAIN_EMAIL}.<br><br>
      We look forward to receiving your documents!</p><br>
      If you have any questions, please send an email using the address below. <br><br>
      <h4>Best, <br>
      Freddie Reyes <br>
      ${process.env.MAIN_EMAIL}</h4><br>
      <p>2403B East Tower, <br>
      Philippine Stock Exchange Center, <br>
      Exchange Rd. Ortigas Center, <br>
      Pasig City 1605 Philippines</p>`
      var doc = new pdf({
          margin: 10
      });
      var buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
          var form1 = Buffer.concat(buffers);
          const mailTransport = nodemailer.createTransport({
              service: 'gmail',
              // host: 'smtp.colfinancial.com',
              // port: 587,
              // secure: false,
              auth: {
                 user: process.env.EMAIL,
                 pass: process.env.PASS
              }
          });
          const mailOptions = {
                from: process.env.EMAIL, // sender address
                to: [user.username, process.env.MAIN_EMAIL],// list of receivers
                subject: 'Your Citisec Online Financial Forms', // Subject line
                html: htmlMessage, // plaintext body alt for html
                attachments:[
                  {
                    filename: "COL Form 1 (Completed).pdf",
                    content: form1
                  },
                  {
                    filename: "COL Form 2 (To Be Completed).pdf",
                    path: 'public/images/form2.pdf'
                  },
                  {
                    filename: "COL Form 3 (To Be Completed).pdf",
                    path: 'public/images/form3.pdf'
                  },
                ]
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
      doc.text(`${user.secondaryLastName}`, secondaryBaseWidth, nameHeight);
      doc.text(`${user.secondaryFirstName}`, secondaryBaseWidth, nameHeight + (nameHeightIncrement*1));
      doc.text(`${user.secondaryMiddleName}`, secondaryBaseWidth, nameHeight + (nameHeightIncrement*2));

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
      doc.text(`${user.secondaryTin}`, secondaryBaseWidth, tinHeight + (tinHeightIncrement*1));
      doc.text(`${user.secondarySSS}`, secondaryBaseWidth, tinHeight + (tinHeightIncrement*2));
      doc.text(`${user.secondaryGender}`, secondaryBaseWidth, tinHeight + (tinHeightIncrement*3));
      doc.text(`${user.secondaryDateOfBirth}`, secondaryBaseWidth + 100, tinHeight + (tinHeightIncrement*3));
      doc.text(`${user.secondaryBirthCountry}`, secondaryBaseWidth, tinHeight + (tinHeightIncrement*4));
      doc.text(`${user.secondaryCitizenshipCountry}`, secondaryBaseWidth, tinHeight + (tinHeightIncrement*5));
      doc.text(`${user.secondaryResidenceCountry}`, secondaryBaseWidth, tinHeight + (tinHeightIncrement*6));

      var contactHeight = 320;
      var contactHeightIncrement = 23;

      // primary contact
      doc.text(`Telephone: ${user.primaryTelephone}`, primaryBaseWidth, contactHeight + (contactHeightIncrement*1));
      doc.text(`Mobile: ${user.primaryMobile}`, primaryBaseWidth, contactHeight + (contactHeightIncrement*2));
      doc.text(`${user.username}`, primaryBaseWidth, contactHeight + (contactHeightIncrement*3));

      // secondary contact
      doc.text(`Telephone: ${user.secondaryTelephone}`, secondaryBaseWidth, contactHeight + (contactHeightIncrement*1));
      doc.text(`Mobile: ${user.secondaryMobile}`, secondaryBaseWidth, contactHeight + (contactHeightIncrement*2));
      doc.text(`${user.secondaryEmail}`, secondaryBaseWidth, contactHeight + (contactHeightIncrement*3));

      var addressHeight = 398.5;
      var addressHeightIncrement = 17;

      // primary address
      doc.text(`${user.primaryNumberAndStreet}`, primaryBaseWidth, addressHeight + (addressHeightIncrement*1));
      doc.text(`${user.primarySubdivision}`, primaryBaseWidth + 80, addressHeight + (addressHeightIncrement*1));
      doc.text(`${user.primaryCity}, ${user.primaryProvince}`, primaryBaseWidth, addressHeight + (addressHeightIncrement*2));
      doc.text(`${user.primaryZipcode}`, primaryBaseWidth + 170, addressHeight + (addressHeightIncrement*2));
      doc.text(`${user.primaryTownAndDistrict}`, primaryBaseWidth, addressHeight + (addressHeightIncrement*3));
      doc.text(`${user.primaryResidenceCountry}`, primaryBaseWidth, addressHeight + (addressHeightIncrement*4));
      doc.text(`${user.primaryCivilStatus}`, primaryBaseWidth, addressHeight + (addressHeightIncrement*5));

      // secondary address
      doc.text(`${user.secondaryNumberAndStreet}`, secondaryBaseWidth, addressHeight + (addressHeightIncrement*1));
      doc.text(`${user.secondarySubdivision}`, secondaryBaseWidth + 80, addressHeight + (addressHeightIncrement*1));
      doc.text(`${user.secondaryCity}, ${user.secondaryProvince}`, secondaryBaseWidth, addressHeight + (addressHeightIncrement*2));
      doc.text(`${user.secondaryZipcode}`, secondaryBaseWidth + 170, addressHeight + (addressHeightIncrement*2));
      doc.text(`${user.secondaryTownAndDistrict}`, secondaryBaseWidth, addressHeight + (addressHeightIncrement*3));
      doc.text(`${user.secondaryResidenceCountry}`, secondaryBaseWidth, addressHeight + (addressHeightIncrement*4));
      doc.text(`${user.secondaryCivilStatus}`, secondaryBaseWidth, addressHeight + (addressHeightIncrement*5));

      var jobHeight = 500;
      var jobHeightIncrement = 16;

      // primary employment
      doc.text(`${user.primaryOccupation}`, primaryBaseWidth, jobHeight + (jobHeightIncrement*1));
      doc.text(`${user.primaryEmploymentStatus}`, primaryBaseWidth, jobHeight + (jobHeightIncrement*2.5));
      doc.text(`${user.primaryEmployer}`, primaryBaseWidth, jobHeight + (jobHeightIncrement*4.5));
      doc.text(`${user.primaryNatureOfBusiness}`, primaryBaseWidth, jobHeight + (jobHeightIncrement*7.5));
      doc.text(`${user.primaryBusinessContact}`, primaryBaseWidth, jobHeight + (jobHeightIncrement*10.5));

      doc.text(`${user.primaryBusinessNumberAndStreet}`, primaryBaseWidth, jobHeight + (jobHeightIncrement*12));
      doc.text(`${user.primaryBusinessSubdivision}`, primaryBaseWidth + 80, jobHeight + (jobHeightIncrement*12));
      doc.text(`${user.primaryBusinessCity}, ${user.primaryProvince}`, primaryBaseWidth, jobHeight + (jobHeightIncrement*13));
      doc.text(`${user.primaryBusinessZipcode}`, primaryBaseWidth + 170, jobHeight + (jobHeightIncrement*13));
      doc.text(`${user.primaryBusinessTownAndDistrict}`, primaryBaseWidth, jobHeight + (jobHeightIncrement*14));
      doc.text(`${user.primaryBusinessCountry}`, primaryBaseWidth, jobHeight + (jobHeightIncrement*15));
      doc.text(`${user.primaryPreferredAddress}`, primaryBaseWidth, jobHeight + (jobHeightIncrement*16));

      // secondary employment
      doc.text(`${user.secondaryOccupation}`, secondaryBaseWidth, jobHeight + (jobHeightIncrement*1));
      doc.text(`${user.secondaryEmploymentStatus}`, secondaryBaseWidth, jobHeight + (jobHeightIncrement*2.5));
      doc.text(`${user.secondaryEmployer}`, secondaryBaseWidth, jobHeight + (jobHeightIncrement*4.5));
      doc.text(`${user.secondaryNatureOfBusiness}`, secondaryBaseWidth, jobHeight + (jobHeightIncrement*7.5));
      doc.text(`${user.secondaryBusinessContact}`, secondaryBaseWidth, jobHeight + (jobHeightIncrement*10.5));

      doc.text(`${user.secondaryBusinessNumberAndStreet}`, secondaryBaseWidth, jobHeight + (jobHeightIncrement*12));
      doc.text(`${user.secondaryBusinessSubdivision}`, secondaryBaseWidth + 80, jobHeight + (jobHeightIncrement*12));
      doc.text(`${user.secondaryBusinessCity}, ${user.secondaryProvince}`, secondaryBaseWidth, jobHeight + (jobHeightIncrement*13));
      doc.text(`${user.secondaryBusinessZipcode}`, secondaryBaseWidth + 170, jobHeight + (jobHeightIncrement*13));
      doc.text(`${user.secondaryBusinessTownAndDistrict}`, secondaryBaseWidth, jobHeight + (jobHeightIncrement*14));
      doc.text(`${user.secondaryBusinessCountry}`, secondaryBaseWidth, jobHeight + (jobHeightIncrement*15));

      // doc.addPage();

      // doc.image('public/images/form2-clean.png', 0, 0, {
      //     width: 610
      // });

      // doc.text(`THIS IS TEST TEXT`, secondaryBaseWidth, jobHeight + (jobHeightIncrement*1));

      doc.end();
      res.redirect('/form3');
    })
    .catch((err) => {
        console.log(err);
    })

});

module.exports = router;
