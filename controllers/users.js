let jwt = require('jwt-simple');
let userModel = require('../models/users');
let secretKey = 'secret';

module.exports = {
  register: function(req, res, next) {
    userModel.createUser(req.body)
      .then(function (data) {
        token = jwt.encode(data, secretKey);
        res.status(201);
        res.json({ token: token });
      })
      .catch(function(err) {
        res.status(400).send(err);
      });
  },

  login: function(req, res, next) {
    userModel.authenticate(req.body)
      .then(function (data) {
        token = jwt.encode(data, secretKey);
        res.json({ token: token });
      })
      .catch(function(err) {
        res.status(400).send(err);
      });
  },

  get: function(req, res, next) {
    // If token exists, then assign it, otherwise send 401
    let token = req.headers.authorization ? req.headers.authorization.split(' ')[0] === 'Bearer' ? req.headers.authorization.split(' ')[1] : null : null;

    if (token) {
      let body = jwt.decode(token, secretKey);

      userModel.getUser(body)
        .then(function (data) {
          res.json(data);
        })
        .catch(function (err) {
          res.status(400).send(err);
        });
    } else {
      res.status(401).send(new Error('User not logged in'));
    }
  }
};
