const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  mobile: {
    type: Number,
    required: true,
    trim: true
  },
  address: {
    state: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    }
  },
  photo: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  encryptedPassword: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    default: 'user',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  }
});

schema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

schema.methods.isValid = function (hashedPassword) {
  return bcrypt.compareSync(hashedPassword, this.encryptedPassword);
}

const User = mongoose.model('User', schema);
module.exports = { User }