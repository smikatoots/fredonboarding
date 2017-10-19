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
      male: user.secondaryGender === 'male',
      female: user.secondaryGender === 'female',
      other: user.secondaryGender === 'other',
      single: user.secondaryCivilStatus === 'single',
      married: user.secondaryCivilStatus === 'married',
      widowed: user.secondaryCivilStatus === 'widowed',
      birthCountryPH: user.secondaryBirthCountry === 'Philippines',
      birthCountryUSA: user.secondaryBirthCountry === 'United States of America',
      birthCountryOther: user.secondaryBirthCountry === 'Other',
      residenceCountryPH: user.secondaryResidenceCountry === 'Philippines',
      residenceCountryUSA: user.secondaryResidenceCountry === 'United States of America',
      residenceCountryOther: user.secondaryResidenceCountry === 'Other',
      citizenshipCountryPH: user.secondaryCitizenshipCountry === 'Philippines',
      citizenshipCountryUSA: user.secondaryCitizenshipCountry === 'United States of America',
      citizenshipCountryOther: user.secondaryCitizenshipCountry === 'Other',
      businessCountryPH: user.secondaryBusinessCountry === 'Philippines',
      businessCountryUSA: user.secondaryBusinessCountry === 'United States of America',
      businessCountryOther: user.secondaryBusinessCountry === 'Other',
      home: user.secondaryPreferredAddress === 'Home',
      business: user.secondaryPreferredAddress === 'Business/Office',
      employed: user.secondaryEmploymentStatus === 'Employed',
      unemployed: user.secondaryEmploymentStatus === 'Unmployed',
      ofw: user.secondaryEmploymentStatus === 'OFW',
      selfemployed: user.secondaryEmploymentStatus === 'Self-Employed',
      student: user.secondaryEmploymentStatus === 'Student',
      retired: user.secondaryEmploymentStatus === 'Retired',
      homemaker: user.secondaryEmploymentStatus === 'Homemaker',
      otherEmployment: user.secondaryEmploymentStatus === 'Other',
      agriaqua: user.secondaryNatureOfBusiness === 'Agri/Aqua',
      consultancy: user.secondaryNatureOfBusiness === 'Consultancy',
      entertainment: user.secondaryNatureOfBusiness === 'Entertainment',
      finance: user.secondaryNatureOfBusiness === 'Finance',
      gov: user.secondaryNatureOfBusiness === 'Government Service',
      mining: user.secondaryNatureOfBusiness === 'Mining',
      transcomm: user.secondaryNatureOfBusiness === 'Transportation/Communication',
      banking: user.secondaryNatureOfBusiness === 'Banking',
      brokerage: user.secondaryNatureOfBusiness === 'Brokerage',
      education: user.secondaryNatureOfBusiness === 'Education',
      food: user.secondaryNatureOfBusiness === 'Food',
      manufacturing: user.secondaryNatureOfBusiness === 'Manufacturing',
      medical: user.secondaryNatureOfBusiness === 'Medical',
      wholesale: user.secondaryNatureOfBusiness === 'Wholesale/Retail',
      utilities: user.secondaryNatureOfBusiness === 'Utilities',
      otherNature: user.secondaryNatureOfBusiness === 'Other',
      asset500k: user.secondaryAssets === '< 500,000',
      asset1m: user.secondaryAssets === '< 1 million',
      asset5m: user.secondaryAssets === '< 5 million',
      asset10m: user.secondaryAssets === '< 10 million',
      asset10mplus: user.secondaryAssets === '> 10 million',
      net500k: user.secondaryNetWorth === '< 500,000',
      net1m: user.secondaryNetWorth === '< 1 million',
      net5m: user.secondaryNetWorth === '< 5 million',
      net10m: user.secondaryNetWorth === '< 10 million',
      net10mplus: user.secondaryNetWorth === '> 10 million',
      income200k: user.secondaryAnnualIncome === '< 200,000',
      income500k: user.secondaryAnnualIncome === '< 500,000',
      income1m: user.secondaryAnnualIncome === '< 1 million',
      income1mplus: user.secondaryAnnualIncome === '> 1 million',
      sourceSalary: user.secondarySourcesOfIncome === 'salary',
      sourceRetirement: user.secondarySourcesOfIncome === 'retirement',
      sourceBusiness: user.secondarySourcesOfIncome === 'business',
      sourceInheritance: user.secondarySourcesOfIncome === 'family',
      sourceInvestments: user.secondarySourcesOfIncome === 'investments',
      none: user.secondaryExperience === 'None',
      limited: user.secondaryExperience === 'Limited',
      good: user.secondaryExperience === 'Good',
      extensive: user.secondaryExperience === 'Extensive',
      preservation: user.secondaryObjectives === 'Capital Preservation',
      longterm: user.secondaryObjectives === 'Long Term Investment',
      growth: user.secondaryObjectives === 'Growth',
      speculation: user.secondaryObjectives === 'Speculation',
    };
    return radioObj
}

router.get('/form2', function(req, res, next) {
  var user = req.user;
  var radioObj = createRadioObj(user);
  User.findById(user._id, (err, user) => {
      res.render('form2', {
          user: user,
          info: user,
          radio: radioObj
      });
  })
});

router.post('/form2-none', function(req, res, next) {
    var infoObj = {
        secondaryFirstName: '',
        secondaryMiddleName: '',
        secondaryLastName: '',
        secondaryTin: '',
        secondarySSS: '',
        secondaryGender: '',
        secondaryDateOfBirth: '',
        secondaryCivilStatus: '',
        secondaryNumberAndStreet: '',
        secondarySubdivision: '',
        secondaryCity: '',
        secondaryProvince: '',
        secondaryZipcode: '',
        secondaryTownAndDistrict: '',
        secondaryTelephone: '',
        secondaryMobile: '',
        secondaryBirthCountry: '',
        secondaryResidenceCountry: '',
        secondaryCitizenshipCountry: '',
        secondaryOccupation: '',
        secondaryEmploymentStatus: '',
        secondaryEmployer: '',
        secondaryNatureOfBusiness: '',
        secondaryBusinessContact: '',
        secondaryBusinessNumberAndStreet: '',
        secondaryBusinessSubdivision: '',
        secondaryBusinessCity: '',
        secondaryBusinessProvince: '',
        secondaryBusinessZipcode: '',
        secondaryBusinessTownAndDistrict: '',
        secondaryBusinessCountry: '',
        secondaryPreferredAddress: '',
        secondaryOfficerListed: '',
        secondaryOfficerBroker: '',
        secondaryShareholderBroker: '',
        secondaryExistingAccount: '',
        secondaryAnotherAccount: '',
        secondaryAssets: '',
        secondaryNetWorth: '',
        secondaryAnnualIncome: '',
        secondarySourcesOfIncome: '',
        secondaryExperience: '',
        secondaryObjectives: ''
    };
});

router.post('/form2', function(req, res, next) {
  req.checkBody('secondaryFirstName', 'First name must not be empty').notEmpty();
  req.checkBody('secondaryLastName', 'Last name must not be empty').notEmpty();
  req.checkBody('secondaryTin', 'TIN # must not be empty').notEmpty();
  req.checkBody('secondaryDateOfBirth', 'Date of birth must not be empty').notEmpty();
  req.checkBody('secondaryCivilStatus', 'Civil status must not be empty').notEmpty();
  req.checkBody('secondaryNumberAndStreet', 'Number and street address must not be empty').notEmpty();
  req.checkBody('secondarySubdivision', 'Barangay and subdivision must not be empty').notEmpty();
  req.checkBody('secondaryCity', 'City must not be empty').notEmpty();
  req.checkBody('secondaryProvince', 'Province must not be empty').notEmpty();
  req.checkBody('secondaryZipcode', 'Zipcode must not be empty').notEmpty();
  req.checkBody('secondaryTownAndDistrict', 'Town and district must not be empty').notEmpty();
  req.checkBody('secondaryOccupation', 'Occupation must not be empty').notEmpty();
  req.checkBody('secondaryEmployer', 'Employer must not be empty').notEmpty();
  req.checkBody('secondaryBusinessContact', 'Business contact number must not be empty').notEmpty();
  req.checkBody('secondaryBusinessNumberAndStreet', 'Business number and street address must not be empty').notEmpty();
  req.checkBody('secondaryBusinessSubdivision', 'Business subdivision must not be empty').notEmpty();
  req.checkBody('secondaryBusinessCity', 'Business city must not be empty').notEmpty();
  req.checkBody('secondaryBusinessProvince', 'Business province must not be empty').notEmpty();
  req.checkBody('secondaryBusinessZipcode', 'Business zipcode must not be empty').notEmpty();
  req.checkBody('secondaryBusinessTownAndDistrict', 'Business town and district must not be empty').notEmpty();
  req.checkBody('secondaryEmail', 'Email must not be empty').notEmpty();
  var errors = req.validationErrors();
  var user = req.user;
  var infoObj = {
    secondaryEmail: req.body.secondaryEmail,
    secondaryFirstName: req.body.secondaryFirstName,
    secondaryMiddleName: req.body.secondaryMiddleName,
    secondaryLastName: req.body.secondaryLastName,
    secondaryTin: req.body.secondaryTin,
    secondarySSS: req.body.secondarySSS,
    secondaryGender: req.body.secondaryGender,
    secondaryDateOfBirth: req.body.secondaryDateOfBirth,
    secondaryCivilStatus: req.body.secondaryCivilStatus,
    secondaryNumberAndStreet: req.body.secondaryNumberAndStreet,
    secondarySubdivision: req.body.secondarySubdivision,
    secondaryCity: req.body.secondaryCity,
    secondaryProvince: req.body.secondaryProvince,
    secondaryZipcode: req.body.secondaryZipcode,
    secondaryTownAndDistrict: req.body.secondaryTownAndDistrict,
    secondaryTelephone: req.body.secondaryTelephone,
    secondaryMobile: req.body.secondaryMobile,
    secondaryBirthCountry: req.body.secondaryBirthCountry,
    secondaryResidenceCountry: req.body.secondaryResidenceCountry,
    secondaryCitizenshipCountry: req.body.secondaryCitizenshipCountry,
    secondaryOccupation: req.body.secondaryOccupation,
    secondaryEmploymentStatus: req.body.secondaryEmploymentStatus,
    secondaryEmployer: req.body.secondaryEmployer,
    secondaryNatureOfBusiness: req.body.secondaryNatureOfBusiness,
    secondaryBusinessContact: req.body.secondaryBusinessContact,
    secondaryBusinessNumberAndStreet: req.body.secondaryBusinessNumberAndStreet,
    secondaryBusinessSubdivision: req.body.secondaryBusinessSubdivision,
    secondaryBusinessCity: req.body.secondaryBusinessCity,
    secondaryBusinessProvince: req.body.secondaryBusinessProvince,
    secondaryBusinessZipcode: req.body.secondaryBusinessZipcode,
    secondaryBusinessTownAndDistrict: req.body.secondaryBusinessTownAndDistrict,
    secondaryBusinessCountry: req.body.secondaryBusinessCountry,
    secondaryPreferredAddress: req.body.secondaryPreferredAddress,
    secondaryOfficerListed: req.body.secondaryOfficerListed,
    secondaryOfficerBroker: req.body.secondaryOfficerBroker,
    secondaryShareholderBroker: req.body.secondaryShareholderBroker,
    secondaryExistingAccount: req.body.secondaryExistingAccount,
    secondaryAnotherAccount: req.body.secondaryAnotherAccount,
    secondaryAssets: req.body.secondaryAssets,
    secondaryNetWorth: req.body.secondaryNetWorth,
    secondaryAnnualIncome: req.body.secondaryAnnualIncome,
    secondarySourcesOfIncome: req.body.secondarySourcesOfIncome,
    secondaryExperience: req.body.secondaryExperience,
    secondaryObjectives: req.body.secondaryObjectives
  };
  var radioObj = createRadioObj(user);
  console.log('radio object', radioObj);
  if (errors) {
      console.log(errors);
      res.render('form2', {
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
