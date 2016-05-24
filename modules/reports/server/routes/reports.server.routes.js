'use strict';

/**
 * Module dependencies
 */
var reportsPolicy = require('../policies/reports.server.policy'),
  reports = require('../controllers/reports.server.controller');

module.exports = function(app) {
  // Reports Routes
  app.route('/api/reports').all(reportsPolicy.isAllowed)
    .get(reports.list)
    .post(reports.create);

  app.route('/api/reports/:reportId').all(reportsPolicy.isAllowed)
    .get(reports.read)
    .put(reports.update)
    .delete(reports.delete);

  // Finish by binding the Report middleware
  app.param('reportId', reports.reportByID);
};
