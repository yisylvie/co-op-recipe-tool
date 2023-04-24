const backButton = document.getElementById("back-button");
const upButton = document.getElementById("scale-up-button");
const downButton = document.getElementById("scale-down-button");
const scaleServingsForm = document.getElementById("scale-servings-form");
const resetButton = document.getElementById("reset");
const scaleFactorButtons = document.getElementsByClassName("scale-factor");
const viewRecipeButton = document.getElementById("view-recipe-button");
const ingredientsInput = document.getElementsByName("ingredients")[0];
const originalIngredients = document.getElementById("original-ingredients").querySelector("div");
const instructionsInput = document.getElementsByName("instructions")[0];

let originalServings;
let scaledServings;
let originalIngredientsArray = [];
let scaledIngredientsArray = [];
let mouseIsDown = false;
let upPressing;
let downPressing;

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

            // edge case for if servings is written in format "serves 5"
            } else if(/^\s*(s|S)erves\s*\d+\s*$/.exec(jsonData.recipeYield)) {
                let serves = /\d+/.exec(jsonData.recipeYield);
                originalServings = ParseIngredient.parseIngredient(serves + " Servings")[0];
                scaledServings = ParseIngredient.parseIngredient(serves + " Servings")[0];
                
            } else {
                // get servings and unit of servings, setting unit to "servings" if there is none
                originalServings = ParseIngredient.parseIngredient(jsonData.recipeYield, { allowLeadingOf: true })[0];
                scaledServings = ParseIngredient.parseIngredient(jsonData.recipeYield, { allowLeadingOf: true })[0];

                if(originalServings.description == "") {
                    originalServings.description = "Servings";
                    scaledServings.description = "Servings";
                }
            }
            servings.value = prettify(originalServings, true);
            resizeServings();
            document.querySelector(".form-subheading h4").innerHTML = "for " + jsonData.name;
            document.getElementsByName("prep time")[0].value = jsonData.prepTime;
            document.getElementsByName("cook time")[0].value = jsonData.cookTime;
            document.getElementsByName("total time")[0].value = jsonData.totalTime;
            appendIngredients(jsonData.recipeIngredients);
            appendInstructions(jsonData.recipeInstructions);
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
        // api no like decimals written like .4 so make um 0.4
        if(sterilize(ingredient).match(/^\s*\.\d+/)) {
            ingredient = sterilize(ingredient).replace(/^\s*\./, "0.");
            console.log(ingredient);
        }
        originalIngredientsArray.push(ParseIngredient.parseIngredient(ingredient, { allowLeadingOf: true })[0]);
        scaledIngredientsArray.push(ParseIngredient.parseIngredient(ingredient, { allowLeadingOf: true })[0]);
        let li = document.createElement("li");
        li.innerHTML = ingredient;
        ul.appendChild(li);
    });
    originalIngredients.appendChild(ul);

    ingredientsInput.innerHTML = "";
    ul = document.createElement("ul");
    ingredients.forEach((ingredient) => {
        if(sterilize(ingredient).match(/^\s*\.\d+/)) {
            ingredient = sterilize(ingredient).replace(/^\s*\./, "0.");
            console.log(ingredient);
        }
        let li = document.createElement("li");
        li.innerHTML = ingredient;
        ul.appendChild(li);
    });
    ingredientsInput.appendChild(ul);
    console.log(originalIngredientsArray);
    ingredientsInput.querySelector("ul").style.width = getTrueWidth(originalIngredients.querySelector("ul")) + "px";
}

// add the instructions from the json data into instructions input on form
function appendInstructions(instructions) {
    instructionsInput.innerHTML = "";
    let ol = document.createElement("ol");
    instructions.forEach((instruction) => {
        if(instruction != null) {
            let li = document.createElement("li");
            li.innerHTML = instruction;
            ol.appendChild(li);
        }
    });
    instructionsInput.appendChild(ol);
}

scaleServingsForm.addEventListener("submit", function(e) {
    e.preventDefault();
});

scaleServingsForm.addEventListener("change", function(e) {
    e.preventDefault();
});

// remove error message if field has been editted
scaleServingsForm.addEventListener("input", function(e) {
    if(e.target.classList.contains("invalid")) {
        e.target.classList.remove("invalid");
        e.target.parentElement.querySelector(".error-message").style.display = "none";
    }
});

// go to previous page when back button is clicked
setClickListener(backButton, function(event){
    event.preventDefault();
    window.location.href = 'create_recipe.html';
});

// scale down by 1 serving when down button is clicked
setClickListener(downButton, function(event){
    event.preventDefault();
    mouseIsDown = false;
    clearInterval(upPressing);
    clearInterval(downPressing);
    // make sure that we don't decrease below one serving
    if(scaledServings.quantity > 1) {
        scaledServings.quantity -= 1;
        unhighlightScaleButton();
        document.getElementById("servings").value = prettify(scaledServings, true);
        resizeServings();
        alterIngredients();
    }
});

// delay for 500ms then fire hold down on mouse press
downButton.addEventListener("mousedown", function(event) {
    mouseIsDown = true;
    console.log("decrease pre");

    event.preventDefault();
    setTimeout(function() {
        holdDown();
        console.log("decrease");
    }, 500);
});

// repeatedly decrease servings every 100ms when button is held
async function holdDown() {
    let myPromise = new Promise(function(resolve) {
        downPressing = setInterval(function(){
            if(mouseIsDown) {
                if(scaledServings.quantity > 1) {
                    console.log("decrease");
                    scaledServings.quantity -= 1;
                    unhighlightScaleButton();
                    document.getElementById("servings").value = prettify(scaledServings, true);
                    resizeServings();
                    alterIngredients();
                } else {
                    clearInterval(downPressing);
                    resolve("trying for go under 1");
                }
            } else {
                clearInterval(downPressing);
                resolve("pau");
            }
        }, 130);
    });
    console.log(await myPromise);
}

// scale up by 1 serving when up button is clicked
setClickListener(upButton, function(event){
    event.preventDefault();
    mouseIsDown = false;
    clearInterval(upPressing);
    clearInterval(downPressing);
    scaledServings.quantity += 1;
    document.getElementById("servings").value = prettify(scaledServings, true);
    unhighlightScaleButton();
    resizeServings();
    alterIngredients();
});

// delay for 500ms then fire hold down on mouse press
upButton.addEventListener("mousedown", function(event) {
    mouseIsDown = true;
    console.log("increase pre");
    event.preventDefault();
    setTimeout(function() {
        holdUp();
        console.log("increase");
    }, 500);
});

// repeatedly increase servings every 100ms when button is held
async function holdUp() {
    let thisPromise = new Promise(function(resolve) {
        upPressing = setInterval(function(){
            if(mouseIsDown) {
                console.log("increase");
                scaledServings.quantity += 1;
                unhighlightScaleButton();
                document.getElementById("servings").value = prettify(scaledServings, true);
                resizeServings();
                alterIngredients();
            } else {
                clearInterval(upPressing);
                resolve("pau");
            }
        }, 130);
    });
    console.log(await thisPromise);
}

// check if mouse is unclicked to turn off up/down scaling
window.addEventListener('mouseup', function() {
    mouseIsDown = false;
    clearInterval(upPressing);
    clearInterval(downPressing);
    console.log("mouseup");
});

// reset servings to original when reset button is clicked
setClickListener(resetButton, function(event){
    resetButton.classList.add("twist");
    event.preventDefault();
    let copy = JSON.parse(JSON.stringify(originalServings.quantity));
    scaledServings.quantity = copy;
    originalServings.quantity = copy;
    unhighlightScaleButton();
    document.getElementById("servings").value = prettify(scaledServings, true);
    resizeServings();
    alterIngredients();
});

resetButton.addEventListener('transitionend', function(){
    resetButton.classList.remove("twist");
});

// resize servings as user types
servings.addEventListener("input", function(event) {
    event.preventDefault();
    resizeServings();
});

// if servings is entered leave focus and fire change event
servings.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.code === 'Enter') {
        event.target.blur();
    }
});

// scale up by # servings inputted on servings enter and
// check that servings are formatted properly once user stops inputting
servings.addEventListener("change", function(event) {
    event.preventDefault();
    // event.stopImmediatePropagation();
    oldServings = scaledServings;
    scaledServings = ParseIngredient.parseIngredient(servings.value, { allowLeadingOf: true })[0];

    // don't change unless input is valid
    if(scaledServings != undefined) {
        unhighlightScaleButton();
        // fix bug where # of servings can't be in the form .4 (no 0 before decimal point)
        if(scaledServings.quantity == null && scaledServings.description[0] == ".") {
            scaledServings = ParseIngredient.parseIngredient("0" + scaledServings.description, { allowLeadingOf: true })[0];
        }
        if(scaledServings.description == "") {
            scaledServings.description = oldServings.description;
        }
        if(scaledServings.quantity <= 0) {
            scaledServings.quantity = oldServings.quantity;
        }
        document.getElementById("servings").value = prettify(scaledServings, true);
        resizeServings();
        alterIngredients();
        return;
    }
    // change to previous value if invalid input
    scaledServings = oldServings;
    document.getElementById("servings").value = prettify(scaledServings, true);
    resizeServings();
});

// send scaled recipe to server when user clicks "scale servings" then redirect to recipe.html
setClickListener(viewRecipeButton, function(event){
    event.preventDefault();
    // if there is only whitespace in the ingredients give error message
    let error = false;
    if(/^\s*$/.test(ingredientsInput.querySelector("ul").textContent)) {
        console.log("stuff:" + ingredientsInput.querySelector("ul").textContent + ":end");
        ingredientsInput.classList.add("invalid");
        ingredientsInput.parentElement.querySelector(".error-message").style.display = "block";
        error = true;
    } 
    if(/^\s*$/.test(instructionsInput.querySelector("ol").textContent)) {
        console.log("stuff:" + instructionsInput.querySelector("ol").textContent + ":end");
        instructionsInput.classList.add("invalid");
        instructionsInput.parentElement.querySelector(".error-message").style.display = "block";
        error = true;
    } 
    if(!error) {
        sendRecipe();
    }
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
        let copy = JSON.parse(JSON.stringify(originalServings.quantity));
        scaledServings.quantity = copy * scaleFactor;
        originalServings.quantity = copy;
        document.getElementById("servings").value = prettify(scaledServings, true);
        resizeServings();
        alterIngredients();
    });
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
    let lis = ingredientsInput.querySelectorAll("li");
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