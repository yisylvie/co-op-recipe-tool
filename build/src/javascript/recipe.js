// grab recipe from ../json/modified_recipe.json and input it into the form
function recieveRecipe() {
    let jsonData;
    fetch('json/modified_recipe.json', {
        method: "POST",
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
        if(cookie in jsonData) {
            jsonData = jsonData[cookie];
            document.getElementById("title").innerHTML = jsonData.name;
            document.getElementById("servings").innerHTML = jsonData.recipeYield;
            document.getElementById("prep time").innerHTML = "Prep: " + jsonData.prepTime;
            document.getElementById("cook time").innerHTML = "Cook: " + jsonData.cookTime;
            document.getElementById("total time").innerHTML = "Total: " + jsonData.totalTime;
            appendIngredients(jsonData.recipeIngredients);
            appendInstructions(jsonData.recipeInstructions);
        } else{
            window.location.href = 'home.html';
        }
    }
}

// add the ingredients from the json data into ingredients div
function appendIngredients(ingredients) {
    const ul = document.getElementById("ingredients-list");
    ul.innerHTML = "";
    ingredients.forEach((ingredient) => {
        let li = document.createElement("li");
        li.innerHTML = ingredient;
        ul.appendChild(li);
    });
}

// add the instructions from the json data into instructions div
function appendInstructions(instructions) {
    const ol = document.getElementById("instructions-list");
    ol.innerHTML = "";
    instructions.forEach((instruction) => {
        let li = document.createElement("li");
        li.innerHTML = instruction;
        ol.appendChild(li);
    });
}

recieveRecipe();