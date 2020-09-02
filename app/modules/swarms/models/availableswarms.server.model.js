'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var availableSwarmSchema = new Schema({

  swarm_id: {
    type: Number,
    unique: true,
    required: true
  },
  blocked_ports: {
    type: Array
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('availableswarm', availableSwarmSchema);