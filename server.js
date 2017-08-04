const Hapi = require('hapi');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const ObjectId = Schema.ObjectId;
require('./boot/db');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 3000
});


const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Package = require('./package.json');
const options = {
  info: {
    'title': 'Test API Documentation',
    'version': Package.version,
  },
  grouping: 'tags'
};

server.register([
  Inert,
  Vision,
  {
    'register': HapiSwagger,
    'options': options
  }
], (err) => {
  server.start((err) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Server running at:', server.info.uri);
    }
  });

  require('./boot/db');
  require('./boot/route')(server);
  require('./middleware')(server);
});



