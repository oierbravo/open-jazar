'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Acta = mongoose.model('Acta'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Acta
 */
exports.create = function(req, res) {
  //console.log(req.body);
  //req.body.date = new Date(req.body.date);
  //console.log(nuDate);
  var acta = new Acta(req.body);
  acta.user = req.user;

  acta.date = new Date(acta.date);
  acta.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(acta);
    }
  });
};

/**
 * Show the current Acta
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var acta = req.acta ? req.acta.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  acta.isCurrentUserOwner = req.user && acta.user && acta.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(acta);
};

/**
 * Update a Acta
 */
exports.update = function(req, res) {
  console.log(req.body);
  var acta = req.acta ;

  acta = _.extend(acta , req.body);

  acta.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(acta);
    }
  });
};

/**
 * Delete an Acta
 */
exports.delete = function(req, res) {
  var acta = req.acta ;

  acta.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(acta);
    }
  });
};

/**
 * List of Actas
 */
exports.list = function(req, res) { 
  Acta.find().sort('-created').populate('user', 'displayName').exec(function(err, actas) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(actas);
    }
  });
};

/**
 * Acta middleware
 */
exports.actaByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Acta is invalid'
    });
  }

  Acta.findById(id).populate('user', 'displayName').exec(function (err, acta) {
    if (err) {
      return next(err);
    } else if (!acta) {
      return res.status(404).send({
        message: 'No Acta with that identifier has been found'
      });
    }
    req.acta = acta;
    next();
  });
};
