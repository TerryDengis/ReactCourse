const User = require('../model/user');

exports.read = (req, res) => {
  const userID = req.params.id;

  User.findById(userID).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json(user);
  });
};

exports.update = (req, res) => {
  //console.log('UPDATE USER = ', req.user, 'UPDATE DATA = ', req.body);
  const { name, password } = req.body;
  const userID = req.user._id;

  User.findById(userID).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }

    // why not use the middleware validation instead?
    if (!name) {
      return res.status(400).json({
        error: 'Name is required'
      });
    } else {
      user.name = name;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: 'Password must be at least 6 characters long'
        });
      } else {
        user.password = password;
      }
    }

    user.save((err, updatedUser) => {
      if (err) {
        console.log('USER UPDATE ERROR', err);

        return res.status(400).json({
          error: 'Cannot update User'
        });
      }
      updatedUser.salt = undefined;
      updatedUser.hashed_password = undefined;
      res.json(updatedUser);
    });
  });
};
