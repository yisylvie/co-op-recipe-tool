// grab recipe from ../json/recipe.json and input it into the form
function recieveRecipe() {
    let jsonData;
    fetch('../json/modified_recipe.json', {
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
        document.getElementById("servings").innerHTML = jsonData.recipeYield;
        document.getElementsByName("prep time")[0].value = jsonData.prepTime;
        document.getElementsByName("cook time")[0].value = jsonData.cookTime;
        document.getElementsByName("total time")[0].value = jsonData.totalTime;
        appendIngredients(jsonData.recipeIngredients);
    }
}

recieveRecipe();

// add the ingredients from the json data into ingredients input on form
function appendIngredients(ingredients) {
    document.getElementById("original-ingredients").querySelector("div").innerHTML = "";
    let ul = document.createElement("ul");
    ingredients.forEach((ingredient) => {
        let li = document.createElement("li");
        li.innerHTML = ingredient;
        ul.appendChild(li);
    });
    document.getElementById("original-ingredients").querySelector("div").appendChild(ul);
    
    document.getElementsByName("ingredients")[0].innerHTML = "";
    ul = document.createElement("ul");
    ingredients.forEach((ingredient) => {
        let li = document.createElement("li");
        li.innerHTML = ingredient;
        ul.appendChild(li);
    });
    document.getElementsByName("ingredients")[0].appendChild(ul);
}

const backButton = document.getElementById("back-button");

backButton.addEventListener('click', function(event){
    event.preventDefault();
    window.location.href = 'create_recipe.html';
}, false);
backButton.addEventListener('keypress', function(event){
    event.preventDefault();
    window.location.href = 'create_recipe.html';
}, false);
