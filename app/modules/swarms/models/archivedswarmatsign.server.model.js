'use strict';

const mongoose = require('mongoose'),
    timeStamp = require('mongoose-timestamp'),
    Schema = mongoose.Schema;

let ArchivedSwarmatsignSchema = new Schema({
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
        required: true
    },
    secretkey: {
        type: String,
        required: true
    },
    status: {
        type: Boolean
    },
    apiKey:{
        type: String,
    }
});

ArchivedSwarmatsignSchema.plugin(timeStamp)

module.exports = mongoose.model('ArchivedSwarmAtsign', ArchivedSwarmatsignSchema);