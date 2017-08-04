const mongoose = require('mongoose');
const dbURI = 'mongodb://localhost/mongose-hapi';

mongoose.connect(dbURI, {useMongoClient: true});

mongoose
  .connection
  .on('connected',
    console.log.bind(console, 'Mongoose connection open to ' + dbURI))
  .on('error', (err) => {
    console.log('Mongoose connection error: ' + err);
  })
  .on('disconnected',
    console.log.bind(console, 'Mongoose connection disconnected'));

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

require('../models/author').model;
require('../models/book').model;

