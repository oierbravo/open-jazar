'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Bazkide = mongoose.model('Bazkide'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Bazkide
 */
exports.create = function(req, res) {
  var bazkide = new Bazkide(req.body);
  bazkide.user = req.user;

  bazkide.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bazkide);
    }
  });
};

/**
 * Show the current Bazkide
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var bazkide = req.bazkide ? req.bazkide.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  bazkide.isCurrentUserOwner = req.user && bazkide.user && bazkide.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(bazkide);
};

/**
 * Update a Bazkide
 */
exports.update = function(req, res) {
  var bazkide = req.bazkide ;

  bazkide = _.extend(bazkide , req.body);

  bazkide.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bazkide);
    }
  });
};

/**
 * Delete an Bazkide
 */
exports.delete = function(req, res) {
  var bazkide = req.bazkide ;

  bazkide.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bazkide);
    }
  });
};

/**
 * List of Bazkides
 */
exports.list = function(req, res) { 
  Bazkide.find().sort('-created').populate('user', 'displayName').exec(function(err, bazkides) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(bazkides);
    }
  });
};

/**
 * Bazkide middleware
 */
exports.bazkideByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Bazkide is invalid'
    });
  }

  Bazkide.findById(id).populate('user', 'displayName').exec(function (err, bazkide) {
    if (err) {
      return next(err);
    } else if (!bazkide) {
      return res.status(404).send({
        message: 'No Bazkide with that identifier has been found'
      });
    }
    req.bazkide = bazkide;
    next();
  });
};
