var express = require('express');
var tokenRouter = require('./routes/tokenRouter');

var app = express();

var port = process.env.PORT || 8080;

// 
app.use('/token', tokenRouter);

app.listen(port, function () {
    console.log('Runing on Port:' + port);

})