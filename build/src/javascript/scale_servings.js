const backButton = document.getElementById("back-button");
const upButton = document.getElementById("scale-up-button");
const downButton = document.getElementById("scale-down-button");
const scaleServingsForm = document.getElementById("scale-servings-form");
const viewRecipeButton = document.getElementById("view-recipe-button");

let originalServings;
let scaledServings;
let originalIngredientsArray = [];
let scaledIngredientsArray = [];

// grab recipe from ../json/modified_recipe.json and input it into the form
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
        originalServings = ParseIngredient.parseIngredient(jsonData.recipeYield)[0];
        scaledServings = ParseIngredient.parseIngredient(jsonData.recipeYield)[0];
        if(originalServings.description == "") {
            originalServings.description = "Servings";
            scaledServings.description = "Servings";
        }
        document.getElementById("servings").innerHTML = prettify(originalServings, true);
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
        originalIngredientsArray.push(ParseIngredient.parseIngredient(ingredient)[0]);
        scaledIngredientsArray.push(ParseIngredient.parseIngredient(ingredient)[0]);
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
    console.log(originalIngredientsArray);
}

scaleServingsForm.addEventListener("submit", function(e) {
    e.preventDefault();
});

// go to previous page when back button is clicked
backButton.addEventListener('click', function(event){
    event.preventDefault();
    window.location.href = 'create_recipe.html';
}, false);
backButton.addEventListener('keypress', function(event){
    event.preventDefault();
    window.location.href = 'create_recipe.html';
}, false);

downButton.addEventListener('click', function(event){
    event.preventDefault();
    alterIngredients(-1);
}, false);
downButton.addEventListener('keypress', function(event){
    event.preventDefault();
    alterIngredients(-1);
}, false);

upButton.addEventListener('click', function(event){
    event.preventDefault();
    alterIngredients(1);
}, false);
upButton.addEventListener('keypress', function(event){
    event.preventDefault();
    alterIngredients(1);
}, false);

viewRecipeButton.addEventListener('click', function(event){
    event.preventDefault();
    sendRecipe();
}, false);
viewRecipeButton.addEventListener('keypress', function(event){
    event.preventDefault();
    sendRecipe();
}, false);

// increase number of servings by amount and scale ingredients accordingly
function alterIngredients(amount) {
    if(scaledServings.quantity > 1 || amount > 0) {
        scaledServings.quantity += amount;
        document.getElementById("servings").innerHTML = prettify(scaledServings, true);
    }
    
    let prevServings = originalServings.quantity;
    let scaleFactor = scaledServings.quantity / prevServings;

    for (let i = 0; i < originalIngredientsArray.length; i++) {
        scaledIngredientsArray[i].quantity = originalIngredientsArray[i].quantity * scaleFactor;
    }

    document.getElementsByName("ingredients")[0].innerHTML = "";
    ul = document.createElement("ul");
    scaledIngredientsArray.forEach((ingredient) => {
        let li = document.createElement("li");
        li.innerHTML = prettify(ingredient);
        ul.appendChild(li);
    });
    document.getElementsByName("ingredients")[0].appendChild(ul);
}

// format ingredient from ingredient object into viewable string
function prettify(ingredient, isServing = false) {
    if(isServing) {
        return scaledServings.quantity + " " + scaledServings.description;
    }

    if(ingredient.unitOfMeasure) {
        return FormatQuantity.formatQuantity(ingredient.quantity, { tolerance: 0.1 }) + " " + ingredient.unitOfMeasure + " " + ingredient.description;
    }
    return FormatQuantity.formatQuantity(ingredient.quantity, { tolerance: 0.1 }) + " " + ingredient.description;
}

// add the ingredients from ingredients input on form into the json data
function grabIngredients(jsonData) {
    let lis = document.getElementsByName("ingredients")[0].querySelectorAll("li");
    let ingredients = [];
    lis.forEach((li) => {
        ingredients.push(li.innerHTML);
    });
    jsonData.recipeIngredients = ingredients;
}

// send scaled recipe to server when user clicks "scale servings"
function sendRecipe() {
    let jsonData = {
        writeScaledRecipe: true,
        recipeIngredients:[],
        recipeYield: prettify(scaledServings, true)
    };
    grabIngredients(jsonData);
    console.log(jsonData);
    fetch('../json/recipe.json', {
        method: "POST",
        body: JSON.stringify(jsonData),
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
        window.location.href = 'recipe.html';
    }
}