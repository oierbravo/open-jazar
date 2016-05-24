'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Bazkide Schema
 */
var BazkideSchema = new Schema({
  bid: {
    type: Number,
    default: 0,
    required: 'Set a number please'
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill Report name',
    trim: true
  },
  status: {
    type: String,
    default: 'alta',
    trim: true
  },
  history: 
    [{ newStatus: String, date: Date }]
  ,
  cuotas: [
      { 
        year: Number,
        month: Number,
        amount:{
            type:Number,
            default:25
        } 
      }
    ]
  ,
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Bazkide', BazkideSchema);
