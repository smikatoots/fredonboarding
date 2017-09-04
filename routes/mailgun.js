var express = require('express');
var router = express.Router();

var mailgunJS = require('mailgun-js');

var apiKey = process.env.MAILGUN_API_KEY;
var domain = 'thecodelancer.com';
var mailgun = mailgunJS({ apiKey, domain });

router.post('/api/mail', (req, res) => {
  var emailData = {
    from: 'Codelancer <syed@thecodelancer.com>',
    to: 'syedm.90@gmail.com',
    subject: 'Codelancer: New Signup',
    text: `Email: ${req.body.email}, Name: ${req.body.name}, Role: ${req.body.userType}, Subject: ${req.body.subject}, Message: ${req.body.message}`,
    html: `<b>Email: ${req.body.email}, Name: ${req.body.name}</b><br>Subject: ${req.body.subject}<br>Message: ${req.body.message}`,
  }

  mailgun.messages().send(emailData, (err, body) => {
    if (err) {
      res.status(404).json(err);
    } else {
      res.json(body);
    }
  });

  // var mailingList = mailgun.lists('newsletter@thecodelancer.com');

  var user = {
    subscribed: true,
    address: req.body.email,
    name: req.body.name,
    // vars: { userType: req.body.userType },
  };
  //
  // mailingList.members().create(user, (err, data) => {
  //   // `data` is the member details
  //   // eslint-disable-next-line no-console
  //   console.log(err, data);
  // });
});


module.exports = router;
