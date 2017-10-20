var express = require('express');
var router = express.Router();
var models = require('../models/models');

var User = models.User;
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(expressValidator());

function createRadioObj(user) {
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
        businessCountryPH: user.primaryBusinessCountry === 'Philippines',
        businessCountryUSA: user.primaryBusinessCountry === 'United States of America',
        businessCountryOther: user.primaryBusinessCountry === 'Other',
        home: user.primaryPreferredAddress === 'Home',
        business: user.primaryPreferredAddress === 'Business/Office',
        employed: user.primaryEmploymentStatus === 'Employed',
        unemployed: user.primaryEmploymentStatus === 'Unmployed',
        ofw: user.primaryEmploymentStatus === 'OFW',
        selfemployed: user.primaryEmploymentStatus === 'Self-Employed',
        student: user.primaryEmploymentStatus === 'Student',
        retired: user.primaryEmploymentStatus === 'Retired',
        homemaker: user.primaryEmploymentStatus === 'Homemaker',
        otherEmployment: user.primaryEmploymentStatus === 'Other',
        agriaqua: user.primaryNatureOfBusiness === 'Agri/Aqua',
        consultancy: user.primaryNatureOfBusiness === 'Consultancy',
        entertainment: user.primaryNatureOfBusiness === 'Entertainment',
        finance: user.primaryNatureOfBusiness === 'Finance',
        gov: user.primaryNatureOfBusiness === 'Government Service',
        mining: user.primaryNatureOfBusiness === 'Mining',
        transcomm: user.primaryNatureOfBusiness === 'Transportation/Communication',
        banking: user.primaryNatureOfBusiness === 'Banking',
        brokerage: user.primaryNatureOfBusiness === 'Brokerage',
        education: user.primaryNatureOfBusiness === 'Education',
        food: user.primaryNatureOfBusiness === 'Food',
        manufacturing: user.primaryNatureOfBusiness === 'Manufacturing',
        medical: user.primaryNatureOfBusiness === 'Medical',
        wholesale: user.primaryNatureOfBusiness === 'Wholesale/Retail',
        utilities: user.primaryNatureOfBusiness === 'Utilities',
        otherNature: user.primaryNatureOfBusiness === 'Other',
        // asset500k: user.primaryAssets === '< 500,000',
        // asset1m: user.primaryAssets === '< 1 million',
        // asset5m: user.primaryAssets === '< 5 million',
        // asset10m: user.primaryAssets === '< 10 million',
        // asset10mplus: user.primaryAssets === '> 10 million',
        // net500k: user.primaryNetWorth === '< 500,000',
        // net1m: user.primaryNetWorth === '< 1 million',
        // net5m: user.primaryNetWorth === '< 5 million',
        // net10m: user.primaryNetWorth === '< 10 million',
        // net10mplus: user.primaryNetWorth === '> 10 million',
        // income200k: user.primaryAnnualIncome === '< 200,000',
        // income500k: user.primaryAnnualIncome === '< 500,000',
        // income1m: user.primaryAnnualIncome === '< 1 million',
        // income1mplus: user.primaryAnnualIncome === '> 1 million',
        // sourceSalary: user.primarySourcesOfIncome === 'salary',
        // sourceRetirement: user.primarySourcesOfIncome === 'retirement',
        // sourceBusiness: user.primarySourcesOfIncome === 'business',
        // sourceInheritance: user.primarySourcesOfIncome === 'family',
        // sourceInvestments: user.primarySourcesOfIncome === 'investments',
        // none: user.primaryExperience === 'None',
        // limited: user.primaryExperience === 'Limited',
        // good: user.primaryExperience === 'Good',
        // extensive: user.primaryExperience === 'Extensive',
        // preservation: user.primaryObjectives === 'Capital Preservation',
        // longterm: user.primaryObjectives === 'Long Term Investment',
        // growth: user.primaryObjectives === 'Growth',
        // speculation: user.primaryObjectives === 'Speculation',
    };
    return radioObj
}

router.get('/form1', function(req, res, next) {
  var user = req.user;
  var radioObj = createRadioObj(user);
  User.findById(user._id, (err, user) => {
      res.render('form1', {
          user: user,
          info: user,
          radio: radioObj,
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
  req.checkBody('primaryOccupation', 'Occupation must not be empty').notEmpty();
  req.checkBody('primaryEmployer', 'Employer must not be empty').notEmpty();
  req.checkBody('primaryBusinessContact', 'Business contact number must not be empty').notEmpty();
  req.checkBody('primaryBusinessNumberAndStreet', 'Business number and street address must not be empty').notEmpty();
  req.checkBody('primaryBusinessSubdivision', 'Business subdivision must not be empty').notEmpty();
  req.checkBody('primaryBusinessCity', 'Business city must not be empty').notEmpty();
  req.checkBody('primaryBusinessProvince', 'Business province must not be empty').notEmpty();
  req.checkBody('primaryBusinessZipcode', 'Business zipcode must not be empty').notEmpty();
  req.checkBody('primaryBusinessTownAndDistrict', 'Business town and district must not be empty').notEmpty();
  // req.checkBody('bankName', 'Bank name must not be empty').notEmpty();
  // req.checkBody('bankNumber', 'Bank number must not be empty').notEmpty();
  // req.checkBody('bankBranch', 'Bank branch must not be empty').notEmpty();

  var errors = req.validationErrors();
  var user = req.user;
  var infoObj = {
      bankName: req.body.bankName,
      bankBranch: req.body.bankBranch,
      bankNumber: req.body.bankNumber,
      howDidYouLearn: req.body.howDidYouLearn,
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
      primaryTelephone: req.body.primaryTelephone,
      primaryMobile: req.body.primaryMobile,
      primaryBirthCountry: req.body.primaryBirthCountry,
      primaryResidenceCountry: req.body.primaryResidenceCountry,
      primaryCitizenshipCountry: req.body.primaryCitizenshipCountry,
      primaryOccupation: req.body.primaryOccupation,
      primaryEmploymentStatus: req.body.primaryEmploymentStatus,
      primaryEmployer: req.body.primaryEmployer,
      primaryNatureOfBusiness: req.body.primaryNatureOfBusiness,
      primaryBusinessContact: req.body.primaryBusinessContact,
      primaryBusinessNumberAndStreet: req.body.primaryBusinessNumberAndStreet,
      primaryBusinessSubdivision: req.body.primaryBusinessSubdivision,
      primaryBusinessCity: req.body.primaryBusinessCity,
      primaryBusinessProvince: req.body.primaryBusinessProvince,
      primaryBusinessZipcode: req.body.primaryBusinessZipcode,
      primaryBusinessTownAndDistrict: req.body.primaryBusinessTownAndDistrict,
      primaryBusinessCountry: req.body.primaryBusinessCountry,
      primaryPreferredAddress: req.body.primaryPreferredAddress,
      // primaryOfficerListed: req.body.primaryOfficerListed,
      // primaryOfficerBroker: req.body.primaryOfficerBroker,
      // primaryShareholderBroker: req.body.primaryShareholderBroker,
      // primaryExistingAccount: req.body.primaryExistingAccount,
      // primaryAnotherAccount: req.body.primaryAnotherAccount,
      // primaryAssets: req.body.primaryAssets,
      // primaryNetWorth: req.body.primaryNetWorth,
      // primaryAnnualIncome: req.body.primaryAnnualIncome,
      // primarySourcesOfIncome: req.body.primarySourcesOfIncome,
      // primaryExperience: req.body.primaryExperience,
      // primaryObjectives: req.body.primaryObjectives
  };
  var radioObj = createRadioObj(user);
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
            if (user.accountType === "joint") {
                res.redirect('form2');
            } else {
                res.redirect('verify')
            }
          }
      })
  }
});

module.exports = router;
