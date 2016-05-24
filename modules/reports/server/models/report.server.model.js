'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Report Schema
 */
var ReportSchema = new Schema({
  year: {
    type: Number,
    default: 2016,
    required: 'Please fill Report year',
  },
  month: {
    type: Number,
    default: 1,
    required: 'Please fill Report month',
  },
  totalCuotasIngresadas: {
    type: Number,
    default: 0,
    required: 'Please fill Report total cuotas ingresadas'
  },
  totalGastos: {
    type: Number,
    default: 0,
    required: 'Please fill Report total gastos'
  },
  totalSocios: {
    type: Number,
    default: 0,
    required: 'Please fill Report total socios'
  },
  altasSocios: {
    type: Number,
    default: 0,
    required: 'Please fill Report altas socios'
  },
  bajasSocios: {
    type: Number,
    default: 0,
    required: 'Please fill Report bajas socios'
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

mongoose.model('Report', ReportSchema);
