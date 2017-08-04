const mongoose = require('mongoose');
const Joi = require('Joi');
const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


module.exports = {
  plural: 'authors',
  routes: [],
  model: mongoose.model('Author', new mongoose.Schema({
    name: {type: String},
    surname: {type: String},
    address: {type: String},
    email: {
      type: String,
      validate: {
        validator: function (v) {
          return emailRegex.test(v);
        },
        message: '{VALUE} is not a valid email!'
      },
    },
  }))
}