'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Acta Schema
 */
var ActaSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
    required: 'Please fill Acta name',
    trim: true
  },
  content: {
    type: String,
    default: ''
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Acta', ActaSchema);
