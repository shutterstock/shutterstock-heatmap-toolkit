var express = require('express');
var http    = require('http');
var url     = require("url");
var path    = require('path');

var config = {
	solr: {
		host: 'localhost',
		port: 8990,
	}
};


exports.createServer = function() {
	var app = express();
	var rootPath = path.join(__dirname, '..')
	process.chdir(rootPath)

	app.use(express.static(path.join(rootPath, 'public')))

	app.get('/solr/*', function(request,response) {
		proxy('GET',request,response);
	});


	app.get('/install.html', function(request,response) {
		var host = request.headers.host;

		var html = [];
		html.push('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">');
html.push('<html>');
html.push('<head>');
html.push('<title>Heatmap Bookmarklet</title>');
html.push('<link type="text/css" rel="stylesheet" href="/bootstrap/css/bootstrap.min.css">');
html.push('</head>');
html.push('<body>');
html.push('<style>');
html.push('#container {');
html.push('	width: 80%;');
html.push('	margin: 0 auto;');
html.push('}');
html.push('</style>');
html.push('	<div id="container">');
html.push('		<h1>Install Heatmap Bookmarklet</h1>');
html.push('		<p>');
html.push('	<li>To setup the bookmarklet, copy the code below into a new bookmark in Chrome.');
html.push('	<li>Open the bookmark manager > Right Click > Add Page > Paste the above code in the "URL" textbox');
html.push('	</p>');
html.push("<pre>javascript:(function() {host='http://"+host+"', _bookmarklet_script = document.createElement('script'), _bookmarklet_script.src=host+'/panel.js', document.body.appendChild(_bookmarklet_script) })()</pre>");
html.push('</div>');
html.push('</body>');
html.push('</html>');

		response.write(html.join(''));
		response.end();
	});


	// proxy for solr requests
	var proxy = function(method,request,response) {
		setHeaders(response);

		var url_parts = url.parse(request.url, true);
		var path = '/solr/'+request.params[0];

		if (url_parts.search) {
			path += url_parts.search;
		}

		var options = {
			method: method,
			host: config.solr.host,
			port: config.solr.port,
			path: path,
		};

		console.log('proxying request: ',options);
		proxyRequest(response,options);
	}



	// send request and return response
	var proxyRequest = function(res,options) {

		var callback = function(response) {
			var str = '';

			response.on('data', function (chunk) {
				str += chunk;
			});

			response.on('end', function () {
				res.write(str);
				res.end();
			});
		}

		http.request(options, callback).end();
	};

	var setHeaders = function(res) {
		res.setHeader('Access-Control-Allow-Origin',  '*');
		res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, DELETE, GET, OPTIONS');
		res.setHeader('Access-Control-Max-Age',       0);
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
		res.setHeader('Cache-Control','max-age=0');
		res.setHeader('Content-Type','application/json');
	}

	return app
}
