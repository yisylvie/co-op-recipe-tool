const backButton = document.getElementById("back-button");
const upButton = document.getElementById("scale-up-button");
const downButton = document.getElementById("scale-down-button");
const scaleServingsForm = document.getElementById("scale-servings-form");
const resetButton = document.getElementById("reset");
const scaleFactorButtons = document.getElementsByClassName("scale-factor");
const viewRecipeButton = document.getElementById("view-recipe-button");
const ingredients = document.getElementsByName("ingredients")[0];
const originalIngredients = document.getElementById("original-ingredients").querySelector("div");
    
let originalServings;
let scaledServings;
let originalIngredientsArray = [];
let scaledIngredientsArray = [];

// grab recipe from json/modified_recipe.json and input it into the form
function recieveRecipe() {
    if(cookie == undefined) {
        console.log("cookie unset");
    }
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

// only recieveRecipe if cookie is set 
grabCookie().then(
    function(value) {recieveRecipe();},
    function(error) {console.log(error);}
);

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

scaleServingsForm.addEventListener("change", function(e) {
    e.preventDefault();
});

// go to previous page when back button is clicked
setClickListener(backButton, function(event){
    event.preventDefault();
    window.location.href = 'create_recipe.html';
});

// scale down by 1 serving when down button is clicked
setClickListener(downButton, function(event){
    event.preventDefault();
    // make sure that we don't decrease below one serving
    if(scaledServings.quantity > 1) {
        scaledServings.quantity -= 1;
        unhighlightScaleButton();
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
    unhighlightScaleButton();
    alterIngredients();
    console.log('1 scale upper');
    // resizeServings();
});

// reset servings to original when reset button is clicked
setClickListener(resetButton, function(event){
    // if(resetButton.classList.contains("twist")) {
    //     resetButton.classList.remove("twist");
    //     resetButton.classList.add("twist2");
    // } else{
    //     resetButton.classList.remove("twist2");
        resetButton.classList.add("twist");
    // }
    // resetButton.classList.remove("twist");
    event.preventDefault();
    scaledServings.quantity = originalServings.quantity;
    unhighlightScaleButton();
    document.getElementById("servings").value = prettify(scaledServings, true);
    alterIngredients();
});

resetButton.addEventListener('transitionend', function(){
    resetButton.classList.remove("twist");
});

// scale up by # servings inputted when servings size is editted
servings.addEventListener("input", function(event) {
    event.preventDefault();
    resizeServings();
    oldServings = scaledServings;
    scaledServings = ParseIngredient.parseIngredient(servings.value)[0];
    // document.getElementById("servings").value = prettify(scaledServings, true);
    if(scaledServings.quantity > 0) {
        unhighlightScaleButton();
        alterIngredients();
    } else {
        scaledServings = oldServings;
        // document.getElementById("servings").value = prettify(scaledServings, true);
    }
});

// check that servings are formatted properly once user stops inputting
servings.addEventListener("change", function(event) {
    event.preventDefault();
    // event.stopImmediatePropagation();
    document.getElementById("servings").value = prettify(scaledServings, true);
    console.log("servingsSubmitted");
    resizeServings();
});

// fix weird bug that makes servings increase by 1 when enter is clicked
servings.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        console.log("bro");
        e.preventDefault();
        document.getElementById("servings").value = prettify(scaledServings, true);
        console.log("servingsSubmitted");
        resizeServings();
    }
});

// send scaled recipe to server when user clicks "scale servings" then redirect to recipe.html
setClickListener(viewRecipeButton, function(event){
    event.preventDefault();
    sendRecipe();
});

// scale up by scale factor when a scale factor button is clicked
for (let i = 0; i < scaleFactorButtons.length; i++) {    
    // index starts with 0 but scale starts from 2x
    let scaleFactor = i + 2;
    setClickListener(scaleFactorButtons[i], function(event){
        event.preventDefault();       
        
        unhighlightScaleButton();

        // highlight button being clicked
        scaleFactorButtons[i].classList.add("primary-button");
        scaleFactorButtons[i].classList.remove("secondary-button");
        scaledServings.quantity = originalServings.quantity * scaleFactor;
        document.getElementById("servings").value = prettify(scaledServings, true);
        alterIngredients();
    });
}

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
    if(isServing) {
        return scaledServings.quantity + " " + scaledServings.description;
    }

    if(ingredient.unitOfMeasure) {
        return FormatQuantity.formatQuantity(ingredient.quantity, { tolerance: 0.1 }) + " " + ingredient.unitOfMeasure + " " + ingredient.description;
    }
    return FormatQuantity.formatQuantity(ingredient.quantity, { tolerance: 0.1 }) + " " + ingredient.description;
}

// if a scale button was previously clicked, unhighlight it
function unhighlightScaleButton() {
    let oldScaleButton = document.querySelector(".primary-button.scale-factor");
    if(oldScaleButton) {
        oldScaleButton.classList.add("secondary-button");
        oldScaleButton.classList.remove("primary-button");
    }
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