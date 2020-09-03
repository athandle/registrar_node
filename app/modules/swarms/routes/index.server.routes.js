
var indexController = require('../controllers/index.server.controller');
module.exports = function(app) {
    app.route('/').get(indexController.indexResponse);
    app.route('/health').get(indexController.healthResponse);

}
