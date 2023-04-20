const upButton = document.getElementById("scale-up-button");
const downButton = document.getElementById("scale-down-button");
const ingredientsList = document.getElementById("ingredients-list");
let originalServings;
let scaledServings;

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
            // get servings and unit of servings, setting unit to "servings" if there is none
            originalServings = ParseIngredient.parseIngredient(jsonData.recipeYield, { allowLeadingOf: true })[0];
            scaledServings = ParseIngredient.parseIngredient(jsonData.recipeYield, { allowLeadingOf: true })[0];

            if(jsonData.url) {
                document.getElementById("original-recipe-link").href = jsonData.url;
            } else{
                document.getElementById("original-recipe-link").style.display = "none";
            }
            appendTimes(jsonData);
            appendIngredients(jsonData.recipeIngredients);
            appendInstructions(jsonData.recipeInstructions);
        } else{
            window.location.href = 'home.html';
        }
    }
}

// add the ingredients from the json data into ingredients div
function appendIngredients(ingredients) {
    const ul = ingredientsList;
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

function appendTimes(jsonData) {
    const timesDiv = document.getElementById("times-div");
    let hasTime = false;
    // check that times are not just whitespace before appending to doc
    if(!/^\s*$/.test(jsonData.prepTime)) {
        let div = document.createElement("div");
        let p = document.createElement("p");
        div.append(p);
        p.innerHTML = "Prep time: " + jsonData.prepTime;
        timesDiv.append(div);
        hasTime = true;
    } 
    if(!/^\s*$/.test(jsonData.cookTime)) {
        let div = document.createElement("div");
        let p = document.createElement("p");
        div.append(p);
        p.innerHTML = "Cook time: " + jsonData.cookTime;
        timesDiv.append(div);
        hasTime = true;
    } 
    if(!/^\s*$/.test(jsonData.totalTime)) {
        let div = document.createElement("div");
        let p = document.createElement("p");
        div.append(p);
        p.innerHTML = "Total time: " + jsonData.totalTime;
        timesDiv.append(div);
        hasTime = true;
    } 
    if(!hasTime) {
        timesDiv.style.display = "none";
    }
}

// only recieveRecipe if cookie is set 
grabCookie().then(
    function(value) {recieveRecipe();},
    function(error) {console.log(error);}
);

// scale down by 1 serving when down button is clicked
setClickListener(downButton, function(event){
    event.preventDefault();
    // openFullscreen();
    window.print();
    // make sure that we don't decrease below one serving
    if(scaledServings.quantity > 1) {
        scaledServings.quantity -= 1;
        document.getElementById("servings").value = prettify(scaledServings, true);
        alterIngredients();
        // resizeServings();
    }
});

// scale up by 1 serving when up button is clicked
setClickListener(upButton, function(event){
    event.preventDefault();
    scaledServings.quantity += 1;
    document.getElementById("servings").value = prettify(scaledServings, true);
    alterIngredients();
    console.log('1 scale upper');
});

// increase number of servings by amount and scale ingredients accordingly
function alterIngredients() {
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
    resizeServings();
    ingredients.querySelector("ul").style.width = getTrueWidth(originalIngredients.querySelector("ul")) + "px";
}

// format ingredient from ingredient object into viewable string
function prettify(ingredient, isServing = false) {
    // round numbers and remove numbers in the description
    scaledServings.description = scaledServings.description.replace(/^\.*\d+/, "");
    if(isServing) {
        return parseFloat(Number(scaledServings.quantity).toFixed(3)) + " " + scaledServings.description;
    } 

    if(ingredient.unitOfMeasure) {
        return FormatQuantity.formatQuantity(ingredient.quantity, { tolerance: 0.1 }) + " " + ingredient.unitOfMeasure + " " + ingredient.description;
    }
    return FormatQuantity.formatQuantity(ingredient.quantity, { tolerance: 0.1 }) + " " + ingredient.description;
}

var elem = window;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

// navigator.clipboard.writeText("and his name is john cenaaa");