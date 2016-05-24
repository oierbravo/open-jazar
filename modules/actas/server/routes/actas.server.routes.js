'use strict';

/**
 * Module dependencies
 */
var actasPolicy = require('../policies/actas.server.policy'),
  actas = require('../controllers/actas.server.controller');

module.exports = function(app) {
  // Actas Routes
  app.route('/api/actas').all(actasPolicy.isAllowed)
    .get(actas.list)
    .post(actas.create);

  app.route('/api/actas/:actaId').all(actasPolicy.isAllowed)
    .get(actas.read)
    .put(actas.update)
    .delete(actas.delete);

  // Finish by binding the Acta middleware
  app.param('actaId', actas.actaByID);
};
