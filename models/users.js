var q = require('q');
var mongoose = require('mongoose');

var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, requred: true },
  password: { type: String, required: true },
});

var User = mongoose.model ('User', UserSchema);

UserSchema.pre ('save', function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified ('password') ) {
    return next ();
  }

  // generate a salt
  bcrypt.genSalt (SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next (err);
    }

    // hash the password along with our new salt
    bcrypt.hash (user.password, salt, null, function (err, hash) {
      if (err) {
        return next (err);
      }

      // override the cleartext password with the hashed one
      user.password = hash;
      next ();
    });
  });
});

var userModel = {}

userModel.createUser = function(data, cb) {
  var defer = q.defer();

  var newUser= new User({
    password: data.password,
    email: data.email,
    name: data.name
  });

  newUser.save(function(err, newUser) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve(newUser);
    }
  });

  return defer.promise;
}

module.exports = userModel;
