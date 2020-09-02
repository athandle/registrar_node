'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * Swarm @sign Schema
 */
var SwarmatsignSchema = new Schema({
    swarm_id: {
        type: Number,
        required: true
    },
    port: {
        type: Number
    },
    uuid: {
        type: String
    },
    atsign: {
        type: String
    },
    status: {
        type: Boolean
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Swarmatsign', SwarmatsignSchema);