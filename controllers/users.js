let jwt = require('jwt-simple');
let userModel = require('../models/users');
let secretKey = 'secret';

module.exports = {
  register: function(req, res, next) {
    userModel.createUser(req.body)
    .then(function (data) {
      token = jwt.encode(data, secretKey);
      res.status(201)
      res.json({ token: token })
    })
    .catch(function(err){
      res.status(400).send();
    })
  }
}
