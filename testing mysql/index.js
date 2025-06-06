// cd to this directory then type
// node index.js
// to run locally

// Require the functionality we need to use:
const { json } = require('express');
var http = require('http'),
	url = require('url'),
	path = require('path'),
	mime = require('mime'),
	path = require('path'),
	fs = require('fs'),
	mysql = require('mysql'),
    // slicer = require('recipe-slicer'),
	// fetch = require('node-fetch'),
	// cookieParser = require("cookie-parser"),
	// sessions = require('express-session'),
    // express = require('express'),
    recipe_parse = require('recipe-data-scraper');

// Make a simple fileserver for all of our static content.
// Everything underneath <STATIC DIRECTORY NAME> will be served.
var app = http.createServer(function(req, resp){
	var filename = path.join(__dirname, "src", url.parse(req.url).pathname);
	(fs.exists || path.exists)(filename, function(exists){
		if (exists) {
			fs.readFile(filename, function(err, data){
				if (err) {
					// File exists but is not readable (permissions issue?)
					resp.writeHead(500, {
						"Content-Type": "text/plain"
					});
					resp.write("Internal server error: could not read file");
					resp.end();
					return;
				}
				
				// File exists and is readable
				var mimetype = mime.getType(filename);
				resp.writeHead(200, {
					"Content-Type": mimetype
				});
				resp.write(data);
				// console.log(data);
				resp.end();
				return;
			});
		}else{
			// File does not exist
			resp.writeHead(404, {
				"Content-Type": "text/plain"
			});
			resp.write("Requested file not found: "+filename);
			resp.end();
			return;
		}
	});
});
app.listen(3456);

let con = mysql.createConnection({
	host: "localhost",
	user: "nodejs",
	password: "nodejs"
});

con.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
});