// Require the functionality we need to use:
const { json } = require('express');
var http = require('http'),
	url = require('url'),
	path = require('path'),
	mime = require('mime'),
	path = require('path'),
	fs = require('fs'),
    slicer = require('recipe-slicer'),
	fetch = require('node-fetch');
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

app.onload = function() {
	console.log("load");
	fs.writeFile('src/json/recipe.json', "{}", err => {
		if (err) {
			console.error(err);
		}
		// file written successfully
	});
}

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
			let jsonData = JSON.parse(body);
			if("fetchRecipeFromUrl" in jsonData) {
				fetchRecipeFromUrl(jsonData);
			} else if("writeModifiedRecipe" in jsonData) {
				writeModifiedRecipe(jsonData);
			} else if("writeScaledRecipe" in jsonData) {
				writeScaledRecipe(jsonData);
			}
		}        
    });
});

// grab a recipe from the url in data then send recipe json back to client
function fetchRecipeFromUrl(data) {
	
	let recipeJson = {};
	let url = data.url;
	console.log(url);
	recipe_parse.default(url)
		// .then(recipeResult => console.log(recipeResult))
		.then(recipeResult => {console.log("80" + recipeResult); recipeJson = recipeResult; sent(recipeJson);})
  		.catch(e => console.log("78" + e));
	function sent(recipeJson){
		const content = JSON.stringify(recipeJson);

		fetch('http://[::1]:8000/php/testing.php', {
			method: "POST",
			body: content,
			headers: { 'content-type': 'application/json', 
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "*"
			}
		})
		.then(response => response.json())
		.then(data => {console.log(data); jsonData = data; sent();})
		.catch(err => console.error(err));
	
		function sent() {
			// window.location.href = 'recipe.html';
			console.log(data);
		}

		// fs.writeFile('src/json/recipe.json', content, err => {
		// if (err) {
		// 	console.error(err);
		// }
		// // file written successfully
		// });
	}
}

// write modified recipe from client into modified_recipe.json after user clicks scale recipe
function writeModifiedRecipe(data) {
	const content = JSON.stringify(data);
	fs.writeFile('src/json/modified_recipe.json', content, err => {
		if (err) {
			console.error(err);
		}
	});
}

// edit modified_recipe.json based on ingredients data sent from client after user clicks view recipe
function writeScaledRecipe(data) {
	try {
		const old = fs.readFileSync('src/json/modified_recipe.json', 'utf8');
		// console.log(121 + old);
		let content = JSON.parse(old);
		content.recipeIngredients = data.recipeIngredients;
		content.recipeYield = data.recipeYield;
		console.log(content);
		content = JSON.stringify(content);
		fs.writeFile('src/json/modified_recipe.json', content, err => {
			if (err) {
				console.error(err);
			}
		});
	} catch (err) {
		console.error(err);
	}

	// fs.readFileSync('src/json/modified_recipe.json', 'utf8', (err, whore) => {
	// 	if (err) {
	// 		console.error(err);
	// 		return;
	// 	}
	// 	console.log(124 + whore);
	// });d
}

// let recipe = new slicer.Recipe;
// 	recipe.set("3 tablespoons of sugar");
// 	console.log(recipe);
// 	recipe.scale(2);
// 	// console.log(recipe);

// 	// console.log(recipe.ingredients);
	
// 	let ingredient = new slicer.Ingredient;
// 	console.log(Object.getOwnPropertyNames(slicer.Recipe));

// 	for (const index in recipe.ingredients) {
// 		console.log(recipe.ingredients[index].unit);
// 		console.log("display")
// 		let bro = slicer.getAmountInUnit(recipe.ingredients[index].amount, recipe.ingredients[index].unit);
// 		bro = slicer.formatFraction(recipe.ingredients[index]);
// 		console.log(JSON.stringify(bro));
// 	}