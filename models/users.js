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

/////////////////////////////////////////////////////////
/// Hash password before save. For security purposes ////
/////////////////////////////////////////////////////////

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

var User = mongoose.model ('User', UserSchema);
var findOne = q.nbind(User.findOne, User);

//////////////////////////////////////////////////////////////
/// Check if has of supplied password matches stored hash ////
//////////////////////////////////////////////////////////////

User.comparePassword = function (candidatePassword, savedPassword, cb) {
  bcrypt.compare(candidatePassword, savedPassword, function (err, isMatch) {
    cb(err, isMatch);
  });
};


///////////////////////////////////////////////////
/// Database model access functions            ////
///////////////////////////////////////////////////

var userModel = {};

userModel.createUser = function(data) {
  var defer = q.defer();

  var newUser = new User({
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
};

userModel.authenticate = function (data) {
  var defer = q.defer();
  findOne( { email: data.email } )
    .then(function (user) {
      User.comparePassword(data.password, user.password, function (err, isMatch) {
        if (isMatch) {
          defer.resolve(user);
        } else {
          defer.reject(err);
        }
      });
    })
    .catch(function (err) {
      defer.reject(data);
    });

  return defer.promise;
};

userModel.getUser = function (data) {
  var defer = q.defer();

  findOne( {email: data.email })
    .then(function (user) {
      defer.resolve(user);
    })
    .catch(function (err) {
      defer.reject(err);
    });

  return defer.promise;
};

module.exports = userModel;
