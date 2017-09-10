var express = require('express');
var router = express.Router();
var models = require('../models/models');

var User = models.User;
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(expressValidator());

router.get('/form1', function(req, res, next) {
  var user = req.user;
  var radioObj = {
      male: user.primaryGender === 'male',
      female: user.primaryGender === 'female',
      other: user.primaryGender === 'other',
      single: user.primaryCivilStatus === 'single',
      married: user.primaryCivilStatus === 'married',
      widowed: user.primaryCivilStatus === 'widowed',
      birthCountryPH: user.primaryBirthCountry === 'Philippines',
      birthCountryUSA: user.primaryBirthCountry === 'United States of America',
      birthCountryOther: user.primaryBirthCountry === 'Other',
      residenceCountryPH: user.primaryResidenceCountry === 'Philippines',
      residenceCountryUSA: user.primaryResidenceCountry === 'United States of America',
      residenceCountryOther: user.primaryResidenceCountry === 'Other',
      citizenshipCountryPH: user.primaryCitizenshipCountry === 'Philippines',
      citizenshipCountryUSA: user.primaryCitizenshipCountry === 'United States of America',
      citizenshipCountryOther: user.primaryCitizenshipCountry === 'Other',
  };
  User.findById(user._id, (err, user) => {
      res.render('form1', {
          user: user,
          info: user,
          radio: radioObj
      });
  })
});

router.post('/form1', function(req, res, next) {
  req.checkBody('primaryFirstName', 'First name must not be empty').notEmpty();
  req.checkBody('primaryLastName', 'Last name must not be empty').notEmpty();
  req.checkBody('primaryTin', 'TIN # must not be empty').notEmpty();
  req.checkBody('primaryDateOfBirth', 'Date of birth must not be empty').notEmpty();
  req.checkBody('primaryCivilStatus', 'Civil status must not be empty').notEmpty();
  req.checkBody('primaryNumberAndStreet', 'Number and street address must not be empty').notEmpty();
  req.checkBody('primarySubdivision', 'Barangay and subdivision must not be empty').notEmpty();
  req.checkBody('primaryCity', 'City must not be empty').notEmpty();
  req.checkBody('primaryProvince', 'Province must not be empty').notEmpty();
  req.checkBody('primaryZipcode', 'Zipcode must not be empty').notEmpty();
  req.checkBody('primaryTownAndDistrict', 'Town and district must not be empty').notEmpty();
  req.checkBody('primaryContact', 'Contact number must not be empty').notEmpty();
  var errors = req.validationErrors();
  var user = req.user;
  var infoObj = {
      primaryFirstName: req.body.primaryFirstName,
      primaryMiddleName: req.body.primaryMiddleName,
      primaryLastName: req.body.primaryLastName,
      primaryTin: req.body.primaryTin,
      primarySSS: req.body.primarySSS,
      primaryGender: req.body.primaryGender,
      primaryDateOfBirth: req.body.primaryDateOfBirth,
      primaryCivilStatus: req.body.primaryCivilStatus,
      primaryNumberAndStreet: req.body.primaryNumberAndStreet,
      primarySubdivision: req.body.primarySubdivision,
      primaryCity: req.body.primaryCity,
      primaryProvince: req.body.primaryProvince,
      primaryZipcode: req.body.primaryZipcode,
      primaryTownAndDistrict: req.body.primaryTownAndDistrict,
      primaryContact: req.body.primaryContact,
      primaryBirthCountry: req.body.primaryBirthCountry,
      primaryResidenceCountry: req.body.primaryResidenceCountry,
      primaryCitizenshipCountry: req.body.primaryCitizenshipCountry,
  };
  var radioObj = {
      male: user.primaryGender === 'male',
      female: user.primaryGender === 'female',
      other: user.primaryGender === 'other',
      single: user.primaryCivilStatus === 'single',
      married: user.primaryCivilStatus === 'married',
      widowed: user.primaryCivilStatus === 'widowed',
      birthCountryPH: user.primaryBirthCountry === 'Philippines',
      birthCountryUSA: user.primaryBirthCountry === 'United States of America',
      birthCountryOther: user.primaryBirthCountry === 'Other',
      residenceCountryPH: user.primaryResidenceCountry === 'Philippines',
      residenceCountryUSA: user.primaryResidenceCountry === 'United States of America',
      residenceCountryOther: user.primaryResidenceCountry === 'Other',
      citizenshipCountryPH: user.primaryCitizenshipCountry === 'Philippines',
      citizenshipCountryUSA: user.primaryCitizenshipCountry === 'United States of America',
      citizenshipCountryOther: user.primaryCitizenshipCountry === 'Other',
  };
  console.log('radio object', radioObj);
  if (errors) {
      console.log(errors);
      res.render('form1', {
        user: user,
        error: errors,
        info: infoObj,
        radio: radioObj
      });
  } else {
      User.findByIdAndUpdate(user._id, infoObj, (err, user) => {
          if(err) {
            return res.send('Error updating information:', err);
          } else {
            res.redirect('verify');
          }
      })
  }
});

module.exports = router;
