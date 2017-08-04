'use strict';

module.exports = function (app) {
  app.ext('onRequest', function (request, reply) {
    // do something
    return reply.continue();
  });
}