require('dotenv').config()
var mongoose = require('./app/config/mongoose');
var express = require('./app/config/express');

var db = mongoose();
var app = express();


// start server
if (process.env.NODE_ENV === 'production') {
    var https = require('https');
    var fs = require('fs');
    var serverOptions = {
        ca: fs.readFileSync("/var/ssl/athandle/bundle.crt"),
        key: fs.readFileSync('/var/ssl/athandle/server.key'),
        cert: fs.readFileSync('/var/ssl/athandle/server.crt')
    };
    server = https.createServer(serverOptions, app);
    server.listen(443);
} else {
    var http = require('http').createServer(app);
    http.listen(process.env.PORT);
    console.log('App running at http://' + process.env.HOST + ':' + process.env.PORT + '/');
}