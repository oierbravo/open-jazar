'use strict';

/**
 * Module dependencies
 */
var bazkidesPolicy = require('../policies/bazkides.server.policy'),
  bazkides = require('../controllers/bazkides.server.controller');

module.exports = function(app) {
  // Bazkides Routes
  app.route('/api/bazkides').all(bazkidesPolicy.isAllowed)
    .get(bazkides.list)
    .post(bazkides.create);

  app.route('/api/bazkides/:bazkideId').all(bazkidesPolicy.isAllowed)
    .get(bazkides.read)
    .put(bazkides.update)
    .delete(bazkides.delete);

  // Finish by binding the Bazkide middleware
  app.param('bazkideId', bazkides.bazkideByID);
};
