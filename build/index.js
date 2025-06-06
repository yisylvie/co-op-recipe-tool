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

const jsonPath = 'src/json/'
// app.onload = function() {
// }
clearFiles();
function clearFiles() {
	fs.writeFile(jsonPath + 'recipe.json', "{}", err => {
		if (err) {
			console.error(err);
		}
		console.log("file cleared");
		// file written successfully
	});
	fs.writeFile(jsonPath + 'modified_recipe.json', "{}", err => {
		if (err) {
			console.error(err);
		}
		console.log("file cleared");
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
			} else if("clearRecipe" in jsonData) {
				clearRecipe(jsonData);
			} else if("clearModifiedRecipe" in jsonData) {
				clearModifiedRecipe(jsonData);
			}
		}
    });
});

// clear the recipe belonging to the given cookie
function clearRecipe(sentData) {
	let cookie = sentData.cookie;
	// remove recipe in recipe.json 
	try {
		const old = fs.readFileSync(jsonPath + 'recipe.json', 'utf8');
		console.log(102 + old);
		let content = JSON.parse(old);
		delete content[cookie];
		console.log(content);
		content = JSON.stringify(content);
		fs.writeFile(jsonPath + 'recipe.json', content, err => {
			if (err) {
				console.error(err);
			}
		});
	} catch (err) {
		console.error(err);
	}
}

// clear the modified recipe belonging to the given cookie
function clearModifiedRecipe(sentData) {
	let cookie = sentData.cookie;
	// remove recipe in recipe.json 
	try {
		const old = fs.readFileSync(jsonPath + 'modified_recipe.json', 'utf8');
		console.log(102 + old);
		let content = JSON.parse(old);
		delete content[cookie];
		console.log(content);
		content = JSON.stringify(content);
		fs.writeFile(jsonPath + 'modified_recipe.json', content, err => {
			if (err) {
				console.error(err);
			}
		});
	} catch (err) {
		console.error(err);
	}
}

// grab a recipe from the url in data then send recipe json back to client
function fetchRecipeFromUrl(urlData) {
	let recipeJson = {};
	let url = urlData.url;
	let cookie = urlData.cookie;
	console.log(url);
	// console.log(localStorage['myKey'] || 'defaultValue');
	recipe_parse.default(url)
		// .then(recipeResult => console.log(recipeResult))
		.then(recipeResult => {console.log("96" + recipeResult); recipeJson = recipeResult; sent(recipeJson);})
  		.catch(e => {console.log("78" + e); sendError(e)});
	
	// add this recipe to recipe.json with its key set to the recipe's cookie
	function sent(recipeJson){
		try {
			const old = fs.readFileSync(jsonPath + 'recipe.json', 'utf8');
			console.log(121 + old);
			let content = JSON.parse(old);
			content[cookie] = recipeJson;
			console.log(content);
			content = JSON.stringify(content);
			fs.writeFile(jsonPath + 'recipe.json', content, err => {
				if (err) {
					console.error(err);
				}
			});
		} catch (err) {
			console.error(err);
		}
	}

	// add error to recipe.json with its key set to the recipe's cookie
	function sendError(error){
		try {
			const old = fs.readFileSync(jsonPath + 'recipe.json', 'utf8');
			console.log(121 + old);
			let content = JSON.parse(old);
			content[cookie] = "Could not find recipe data";
			content = JSON.stringify(content);
			fs.writeFile(jsonPath + 'recipe.json', content, err => {
				if (err) {
					console.error(err + "159");
				}
			});
		} catch (err) {
			console.error(err);
		}
	}
}

// write modified recipe from client into modified_recipe.json after user clicks "scale recipe"
function writeModifiedRecipe(sentData) {
	// add this recipe to modified_recipe.json with its key set to the recipe's cookie
	try {
		let cookie = sentData.cookie;
		const old = fs.readFileSync(jsonPath + 'modified_recipe.json', 'utf8');
		console.log(177 + old);
		let content = JSON.parse(old);
		content[cookie] = sentData.recipe;
		console.log(content);
		content = JSON.stringify(content);
		fs.writeFile(jsonPath + 'modified_recipe.json', content, err => {
			if (err) {
				console.error(err);
			}
		});
	} catch (err) {
		console.error(err);
	}
}

// edit modified_recipe.json based on ingredients data sent from client after user clicks view recipe
function writeScaledRecipe(sentData) {
	// add changed ingredients to modified_recipe.json with its key set to the recipe's cookie
	try {
		let cookie = sentData.cookie;
		const old = fs.readFileSync(jsonPath + 'modified_recipe.json', 'utf8');
		// console.log(121 + old);
		console.log(177 + old);
		let content = JSON.parse(old);

		content[cookie].recipeIngredients = sentData.recipeIngredients;
		content[cookie].recipeYield = sentData.recipeYield;
		console.log(content);
		content = JSON.stringify(content);
		fs.writeFile(jsonPath + 'modified_recipe.json', content, err => {
			if (err) {
				console.error(err);
			}
		});
	} catch (err) {
		console.error(err);
	}

	// fs.readFileSync(jsonPath + 'modified_recipe.json', 'utf8', (err, whore) => {
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

