var express = require('express');
var router = express.Router();
var models = require('../models/models');

var User = models.User;
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(expressValidator());


router.get('/form0', function(req, res, next) {
  var user = req.user;
  var radioObj = {
      individual: user.accountType === "individual",
      joint: user.accountType === "joint",
      itf: user.accountType === "itf"
  }
  User.findById(user._id, (err, user) => {
      res.render('form0', {
          user: user,
          info: user,
          radio: radioObj
      });
  })
});

router.post('/form0', function(req, res, next) {
  var infoObj = {
      accountType: req.body.accountType
  };
  var user = req.user;
  User.findByIdAndUpdate(user._id, infoObj, (err, user) => {
      if(err) {
        return res.send('Error updating information:', err);
      } else {
        res.redirect('form1');
      }
  })
});

module.exports = router;
