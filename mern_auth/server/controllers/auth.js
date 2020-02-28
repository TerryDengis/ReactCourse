const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');

const User = require('../model/user');

sgMail.setApiKey(process.env.SEND_GRID_API);

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: ' Email already registered'
      });
    }

    const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, {
      expiresIn: '30m'
    });
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Account activation link`,
      html: `
      <h2>Please use the following link to activate your account</h2>
      <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
      <hr />
      <p>This email may contain sensitive information</p>
      <p>${process.env.CLIENT_URL}</p>
      `
    };
    console.log(token);

    sgMail
      .send(emailData)
      .then(sent => {
        console.log('SIGNUP EMAIL SENT');
        return res.json({
          message: `Email has been sent to ${email}.  Follow the instructions enclosed in it.`
        });
      })
      .catch(err => {
        console.log('ERROR ', err);
        return res.json({
          message: ` Could not send email ${err.code} ${err.message} ${token}.`
        });
      });
  });
};

exports.accountActivation = (req, res) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
        return res.status(401).json({
          error: 'Expired link.  Signup again'
        });
      }
      const { name, email, password } = jwt.decode(token);
      const newUser = new User({ name, email, password });

      newUser.save((err, success) => {
        if (err) {
          console.log('SIGNUP ERROR', err);
          return res.status(401).json({
            error: 'Error saving to database'
          });
        }
      });
      res.json({
        message: 'Sign-up succesful, you can now login!'
      });
    });
  } else {
    console.log('NO TOKEN RECEIVED');
    return res.status(401).json({
      error: 'No token recieved'
    });
  }
};

// This approach does not utilized email confimation
exports.signupBasic = (req, res) => {
  //console.log(req.body);
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: ' Email already registered'
      });
    }

    const newUser = new User({ name, email, password });

    newUser.save((err, success) => {
      if (err) {
        console.log('SIGNUP ERROR', err);
        return res.status(400).json({
          error: err
        });
      }
    });
    res.json({
      message: 'Sign-up succesful, you can now login!'
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist.  Please signup.'
      });
    }
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Password does not match with that email address with that email address.'
      });
    } else {
      // generate token and send to client
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      const { _id, name, email, role } = user;

      return res.json({
        token,
        user: { _id, name, email, role }
      });
    }
  });
};
