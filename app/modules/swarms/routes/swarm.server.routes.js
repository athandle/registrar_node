var usersController = require('../controllers/swarm.server.controller');

module.exports = function (app) {
    app.route('/api/assignswarm')
        .post(usersController.assignSwarm);
}