const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const sgMail = require('@sendgrid/mail');
const _ = require('lodash');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');

const User = require('../model/user');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.authenticate;
exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: 'Email already registered'
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
      <p>${process.env.CLIENT_URL}/account-activation/${token}</p>
      <hr />
      <p>This email may contain sensitive information</p>
      <p>${process.env.CLIENT_URL}</p>
      `
    };

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
          error: 'Expired link.  Signup again!'
        });
      }
      console.log('hello');

      const { name, email, password } = jwt.decode(token);

      const newUser = new User({ name, email, password });

      newUser.save((err, success) => {
        if (err) {
          console.log('SIGNUP ERROR', err);
          return res.status(401).json({
            error: 'Error saving to database!'
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
      error: 'No token recieved!'
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
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      const { _id, name, email, role } = user;

      return res.json({
        token,
        user: { _id, name, email, role }
      });
    }
  });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET // req.user
});

exports.adminMiddleware = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User does not exist.'
      });
    }
    if (user.role !== 'admin') {
      return res.status(400).json({
        error: 'Not an admin. Access denied'
      });
    }
    req.profile = user;
    next();
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User does not exist.'
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, {
      expiresIn: '10m'
    });
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password reset link`,
      html: `
    <h2>Please use the following link to reset your password!</h2>
    <p>${process.env.CLIENT_URL}/auth/reset-password/${token}</p>
    <hr />
    <p>This email may contain sensitive information</p>
    <p>${process.env.CLIENT_URL}</p>
    `
    };
    user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({
          error: 'Database connections error on forgot password request.'
        });
      }
    });

    sgMail
      .send(emailData)
      .then(sent => {
        console.log('RESET PASSWORD EMAIL SENT');
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

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (err, decoded) => {
      if (err) {
        return res.status(400).json({
          error: 'Link has expired, please try again!'
        });
      }
      User.findOne({ resetPasswordLink }, (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: 'Something went wrong.  Try again later.'
          });
        }
        const updatedFields = {
          password: newPassword,
          resetPasswordLink: ''
        };
        user = _.extend(user, updatedFields);
        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: 'Error resetting password.  Try again later.'
            });
          }
          res.json({
            message: 'Password has been reset, you can now use your new password'
          });
        });
      });
    });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = (req, res) => {
  const { idToken } = req.body;
  console.log('in.googleLogin');
  client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
    .then(resp => {
      const { email_verified, name, email } = resp.payload;
      console.log('in.then');

      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            const { _id, email, name, role } = user;

            return res.json({
              token,
              user: { _id, email, name, role }
            });
          } else {
            const password = email + process.env.JWT_SECRET;
            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                console.log('ERROR GOOGLE LOGIN USER SAVE ', err);
                return resp.status(400).json({
                  error: 'User signup failed with Google'
                });
              } else {
                const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, {
                  expiresIn: '1d'
                });
                const { _id, email, name, role } = data;

                res.json({
                  token,
                  user: { _id, email, name, role }
                });
              }
            });
          }
        });
      }
    })
    .catch(err => {
      console.log('ERROR GOOGLE VERIFICATION ', err);
      return res.status(400).json({
        error: 'User verification failed with Google'
      });
    });
};

exports.facebookLogin = (req, res) => {
  console.log('FACEBOOK LOGIN ', req.body);

  const { userID, accessToken } = req.body;
  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  return fetch(url, {
    method: 'GET'
  })
    .then(response => response.json())
    .then(response => {
      const { email, name } = response;
      User.findOne({ email }).exec((err, user) => {
        if (user) {
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
          const { _id, email, name, role } = user;

          return res.json({
            token,
            user: { _id, email, name, role }
          });
        } else {
          const password = email + process.env.JWT_SECRET;
          user = new User({ name, email, password });
          user.save((err, data) => {
            if (err) {
              console.log('ERROR FACEBOOK LOGIN USER SAVE ', err);
              return resp.status(400).json({
                error: 'User signup failed with Facebook'
              });
            } else {
              const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET, {
                expiresIn: '1d'
              });
              const { _id, email, name, role } = data;

              res.json({
                token,
                user: { _id, email, name, role }
              });
            }
          });
        }
      });
    })
    .catch(err => {
      console.log('ERROR FACEBOOK VERIFICATION ', err);
      return res.status(400).json({
        error: 'User verification failed with Facebook'
      });
    });
};
