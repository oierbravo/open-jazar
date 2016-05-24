'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Report = mongoose.model('Report'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Report
 */
exports.create = function(req, res) {
  var report = new Report(req.body);
  report.user = req.user;

  report.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(report);
    }
  });
};

/**
 * Show the current Report
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var report = req.report ? req.report.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  report.isCurrentUserOwner = req.user && report.user && report.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(report);
};

/**
 * Update a Report
 */
exports.update = function(req, res) {
  var report = req.report ;

  report = _.extend(report , req.body);

  report.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(report);
    }
  });
};

/**
 * Delete an Report
 */
exports.delete = function(req, res) {
  var report = req.report ;

  report.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(report);
    }
  });
};

/**
 * List of Reports
 */
exports.list = function(req, res) { 
  Report.find().sort('-created').populate('user', 'displayName').exec(function(err, reports) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(reports);
    }
  });
};

/**
 * Report middleware
 */
exports.reportByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Report is invalid'
    });
  }

  Report.findById(id).populate('user', 'displayName').exec(function (err, report) {
    if (err) {
      return next(err);
    } else if (!report) {
      return res.status(404).send({
        message: 'No Report with that identifier has been found'
      });
    }
    req.report = report;
    next();
  });
};
