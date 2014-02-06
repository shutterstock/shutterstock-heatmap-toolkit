#! /usr/bin/env node
var express = require('../lib/index.js');
var app = express.createServer();

var port = parseInt(process.env.HTTP_PORT || process.argv[2] || 8080);

app.listen(port);
