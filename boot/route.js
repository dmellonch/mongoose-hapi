'use strict';
const mongoose = require('mongoose');
const glob = require('glob');
const Joi = require('Joi');
const f = require('util').format;
const dbURI = 'mongodb://localhost/';

function _createStandardApi(model, pluralName, disabled) {


  disabled = disabled || [];
  const singularName = model.modelName.charAt(0).toUpperCase() + model.modelName.slice(1)
  const apiRoot = '/api/' + pluralName;
  let payLoad = {};
  Object.keys(model.schema.obj).forEach((k) => {
    payLoad[k] = Joi.any();
  }); //todo le validazioni vanno rieseguite prima del metodo mongoose.* (tutto string per ora)
  return [
    {
      method: 'GET',
      path: apiRoot + '/{id}',
      config: {
        handler: (request, reply) => {

          mongoose.connect(dbURI + request.info.hostname, {useMongoClient: true}).then(
            () => {
              model.findById(request.params.id, (error, doc) => {
                if (error) {
                  console.error(error);
                }
                reply(doc);
              });
              /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
            },
            err => { /** handle initial connection error */ }
          );


        },
        description: f('Get %s by id', singularName),
        notes: f('Returns a %s', singularName),
        tags: ['api', model.modelName], // ADD THIS TAG
        validate: {
          params: {
            id: Joi.any()
                   .required()
                   .description(f('the id for the %s item', singularName)),
          }
        }
      }
    },
    {
      method: 'GET',
      path: apiRoot,
      config: {
        handler: (request, reply) => {
          model.find((error, docs) => {
            if (error) {
              console.error(error);
            }
            reply(docs);
          });
        },
        description: 'Get ' + pluralName,
        notes: 'Returns ' + pluralName,
        tags: ['api', model.modelName] // ADD THIS TAG
      }
    },
    {
      method: 'POST',
      path: apiRoot,
      config: {
        handler: (request, reply) => {
          model.create(request.payload, (error, doc) => {
            if (error) {
              return reply(error);
            }
            reply(doc);
          });
        },
        validate: {
          payload: payLoad
        },
        description: 'POST ' + singularName,
        notes: 'Insert an ' + singularName,
        tags: ['api', model.modelName] // ADD THIS TAG
      }
    },
    {
      method: 'PUT',
      path: apiRoot + '/{id}',
      config: {
        handler: (request, reply) => {
          model.findOneAndUpdate({_id: request.params.id}, request.payload, {
            new: true, upsert: true
          }, (err, doc) => {
            if (err)
              return reply(err);

            reply(doc);
          });
        },
        validate: {
          payload: payLoad,
          params: {
            id: Joi.any()
                   .required()
                   .description(f('the id for the %s item', singularName)),
          },
        },
        description: 'PUT ' + singularName,
        notes: 'Insert o replace an ' + singularName,
        tags: ['api', model.modelName] // ADD THIS TAG
      }
    },
    {
      method: 'DELETE',
      path: apiRoot + '/{id}',
      config: {
        handler: (request, reply) => {
          model.deleteOne({_id: request.params.id}, (err, doc) => {
            if (err)
              return reply(err);

            reply(doc);
          });
        },
        validate: {
          params: {
            id: Joi.any()
                   .required()
                   .description(f('the id for the %s item', singularName)),
          },
        },
        description: 'DELETE an ' + singularName,
        notes: 'Delete an ' + singularName,
        tags: ['api', model.modelName] // ADD THIS TAG
      }
    },
    {
      method: 'DELETE',
      path: apiRoot,
      config: {
        handler: (request, reply) => {
          model.deleteMany((err, doc) => {
            if (err)
              return reply(err);

            reply(doc);
          });
        },
        description: 'DELETE ' + pluralName,
        notes: 'Delete all ' + pluralName,
        tags: ['api', model.modelName] // ADD THIS TAG
      }
    },
    {
      method: 'PATCH',
      path: apiRoot + '/{id}',
      config: {
        handler: (request, reply) => {
          model.findOneAndUpdate({_id: request.params.id}, {$set: request.payload}, {
            new: true, runValidators: true
          }, (err, doc) => {
            if (err)
              return reply(err);

            reply(doc);
          });
        },
        validate: {
          payload: payLoad,
          params: {
            id: Joi.any()
                   .required()
                   .description(f('the id for the %s item', singularName)),
          },
        },
        description: 'PATCH ' + singularName,
        notes: 'Update/modify ' + singularName,
        tags: ['api', model.modelName] // ADD THIS TAG
      }
    }
  ].filter(route => !disabled.some((d) => route.method === d));
}


module.exports = function (app) {

  glob('models/*.js', function (err, files) {

    if (err) {
      console.log('NON sono stati trovati i files dei modelli!');
      process.exit(1);
    }
    files.map(path => require('../' + path))
         .map(m => _createStandardApi(m.model, m.plural, m.disabled))
         .filter(r => app.route(r));

  })
}