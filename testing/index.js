// Require the functionality we need to use:
// const { json } = require('express');
var http = require('http'),
	url = require('url'),
	path = require('path'),
	mime = require('mime'),
	path = require('path'),
	fs = require('fs'),
    slicer = require('recipe-slicer'),
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
				console.log(data);
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

// when data is sent from client
app.on('request', function (req, resp) {
    if (req.method == 'POST') {
        var body = '';
    }

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
		if(body) {
			console.log("62" + body);
			writeFile(body);
		}
        
		// resp.write("whoreasdf");
    });
});

function writeFile(data) {
	
	let recipeJson = {};
	let jsonData = JSON.parse(data);
	let url = jsonData.url;
	console.log(url);
	recipe_parse.default(url)
		// .then(recipeResult => console.log(recipeResult))
		.then(recipeResult => {console.log("80" + recipeResult); recipeJson = recipeResult; sent(recipeJson);})
  		.catch(e => console.log(e));
	function sent(recipeJson){
		const content = JSON.stringify(recipeJson);

		fs.writeFile('src/bro.json', content, err => {
		if (err) {
			console.error(err);
		}
		// file written successfully
		});
	}
	
}

// let recipe = new slicer.Recipe;
// 	recipe.set("3 cups of sugar");
// 	console.log(recipe);