'use strict';

const mongoose = require('mongoose'),
    timeStamp = require('mongoose-timestamp'),
    Schema = mongoose.Schema;

let SwarmatsignSchema = new Schema({
    swarmId: {
        type: String,
        required: true
    },
    port: {
        type: Number,
        required: true
    },
    uuid: {
        type: String
    },
    atsign: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: Boolean
    }
});

SwarmatsignSchema.index({ swarmId: 1, port: 1 }, { unique: true })

SwarmatsignSchema.plugin(timeStamp)

module.exports = mongoose.model('Swarmatsign', SwarmatsignSchema);