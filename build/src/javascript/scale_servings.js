const backButton = document.getElementById("back-button");
const upButton = document.getElementById("scale-up-button");
const downButton = document.getElementById("scale-down-button");
const scaleServingsForm = document.getElementById("scale-servings-form");
const viewRecipeButton = document.getElementById("view-recipe-button");

let originalServings;
let scaledServings;
let originalIngredientsArray = [];
let scaledIngredientsArray = [];

// grab recipe from json/modified_recipe.json and input it into the form
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
            // set servings to 1 recipe if servings is unset
            if(jsonData.recipeYield == "") {
                originalServings = ParseIngredient.parseIngredient("1 Recipes")[0];
                scaledServings = ParseIngredient.parseIngredient("1 Recipes")[0];
            } else {
                // get servings and unit of servings, setting unit to "servings" if there is none
                originalServings = ParseIngredient.parseIngredient(jsonData.recipeYield)[0];
                scaledServings = ParseIngredient.parseIngredient(jsonData.recipeYield)[0];
                if(originalServings.description == "") {
                    originalServings.description = "Servings";
                    scaledServings.description = "Servings";
                }
            }
            servings.value = prettify(originalServings, true);
            resizeServings();
            document.getElementsByName("prep time")[0].value = jsonData.prepTime;
            document.getElementsByName("cook time")[0].value = jsonData.cookTime;
            document.getElementsByName("total time")[0].value = jsonData.totalTime;
            appendIngredients(jsonData.recipeIngredients);
        } else{
            window.location.href = 'home.html';
        }
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
    document.getElementsByName("ingredients")[0].querySelector("ul").style.width = getTrueWidth(originalIngredients.querySelector("ul")) + "px";
}

scaleServingsForm.addEventListener("submit", function(e) {
    e.preventDefault();
});

// go to previous page when back button is clicked
setClickListener(backButton, function(event){
    event.preventDefault();
    window.location.href = 'create_recipe.html';
});

setClickListener(downButton, function(event){
    event.preventDefault();
    // make sure that we don't decrease below one serving
    if(scaledServings.quantity > 1) {
        scaledServings.quantity -= 1;
        document.getElementById("servings").value = prettify(scaledServings, true);
    }
    resizeServings();
    alterIngredients(-1);
});

setClickListener(upButton, function(event){
    event.preventDefault();
    // make sure that we don't decrease below one serving
    scaledServings.quantity += 1;
    document.getElementById("servings").value = prettify(scaledServings, true);
    resizeServings();
    alterIngredients(1);
});

servings.addEventListener("input", function(event) {
    event.preventDefault();
    scaledServings = ParseIngredient.parseIngredient(servings.value)[0];
    resizeServings();
    alterIngredients(scaledServings.quantity);
});

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
        recipeYield: prettify(scaledServings, true),
        "cookie": cookie
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