const mongoose = require('mongoose');

module.exports = {
  plural: 'books',
  disabled: ['DELETE'],
  routes: [],
  model: mongoose.model('Book', new mongoose.Schema({
    title: {type: String},
    year: {type: String}
  }))
}