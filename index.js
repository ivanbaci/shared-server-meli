var express = require('express');
var routes = require('./config/routes')

var app = express();

var port = process.env.PORT || 8080;

routes(app);

app.listen(port, function () {
    console.log('Runing on Port:' + port);

})