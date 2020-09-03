var mongoose = require('mongoose');

module.exports = function () {
    mongoose.Promise = global.Promise;
    db = mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useCreateIndex: true }).then(function () {
        console.log('Connected to database successfully', process.env.DB_URL);
    }, function (err) {
        console.log('Database connection timeout error');
    });

    require('../modules/swarms/models/availableswarms.server.model');
    require('../modules/swarms/models/swarmatsign.server.model');
    require('../modules/swarms/models/archivedswarmatsign.server.model');
    return db;
}