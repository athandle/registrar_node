exports.indexResponse = function(req, res) {
    res.status(200).send({
        messsage: 'Server running at http://' + process.env.HOST + ':' + process.env.PORT,
        status: 'up',
        success: true
    });
}
exports.healthResponse = function(req, res) {
    res.status(200).send({
        messsage: 'API is healthy.',
        success: true
    });
    
}
