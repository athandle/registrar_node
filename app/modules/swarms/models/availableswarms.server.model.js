'use strict';

const mongoose = require('mongoose'),
  timeStamp = require('mongoose-timestamp'),
  Schema = mongoose.Schema;

let availableSwarmSchema = new Schema({
  swarmId: {
    type: String,
    unique: true,
    required: true
  },
  blockedPorts: {
    type: [Number],
    required: true
  },
  isAvailableToUse: {
    type: Boolean,
    default: true
  }
});

availableSwarmSchema.plugin(timeStamp)

module.exports = mongoose.model('availableswarm', availableSwarmSchema);