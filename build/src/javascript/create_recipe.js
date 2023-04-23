let url;
console.log(cookie);
console.log(sessionStorage);
const recipeInputForm = document.getElementById("recipe-input-form");
const ingredientsInput = document.getElementsByName("ingredients")[0];
const instructionsInput = document.getElementsByName("instructions")[0];
const scaleServingsButton = document.getElementById("scale-servings-button");

// grab recipe from json/recipe.json and input it into the form
function recieveRecipe() {
    let jsonData;
    fetch('json/recipe.json', {
        method: "POST",
        credentials:"same-origin",
    })
    .then(response => response.json())
    .then(data => {console.log(data); jsonData = data; sent();})
    .catch(err => console.error(err));
    
    function sent() {
        if(cookie in jsonData) {
            if(jsonData[cookie] == "Could not find recipe data") {
                document.querySelector("header>h2").innerHTML = "Create Recipe";
            } else {
                document.querySelector("header>h2").innerHTML = "Review Recipe";
                // document.querySelector(".reminder").parentElement.style.display = "flex";
                jsonData = jsonData[cookie];
                if("name" in jsonData) {
                    document.getElementsByName("title")[0].value = sterilize(jsonData.name);
                }
                if("recipeYield" in jsonData) {
                    document.getElementsByName("servings")[0].value = sterilize(jsonData.recipeYield);
                }
                if("prepTime" in jsonData) {
                    document.getElementsByName("prep time")[0].value = sterilize(jsonData.prepTime);
                }
                if("cookTime" in jsonData) {
                    document.getElementsByName("cook time")[0].value = sterilize(jsonData.cookTime);
                }
                if("totalTime" in jsonData) {
                    document.getElementsByName("total time")[0].value = sterilize(jsonData.totalTime);
                }
                url = jsonData.url;
                if("recipeIngredients" in jsonData) {
                    appendIngredients(jsonData.recipeIngredients);
                }
                if("recipeInstructions" in jsonData) {
                    appendInstructions(jsonData.recipeInstructions);
                }
            }
        } else{
            console.log("cookie not in jsonData");
            document.querySelector("header>h2").innerHTML = "Create Recipe";
        }
    }
}

// check that the cookie is set before grabbing recipe
if(cookie == undefined) {
    grabCookie().then(
        function(value) {recieveRecipe();},
        function(error) {console.log(error);}
    );
} else {
    recieveRecipe();
}

// add the ingredients from the json data into ingredients input on form
function appendIngredients(ingredients) {
    ingredientsInput.innerHTML = "";
    let ul = document.createElement("ul");
    ingredients.forEach((ingredient) => {
        if(ingredient != null) {
            let li = document.createElement("li");
            li.innerHTML = ingredient;
            ul.appendChild(li);
        }
    });
    ingredientsInput.appendChild(ul);
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


recipeInputForm.addEventListener("submit", function(e) {
    e.preventDefault();
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

// event fired when servings is written in wrong format or title is blank
recipeInputForm.addEventListener('invalid', (function () {
    return function (e) {
        e.preventDefault();
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
        e.target.classList.add("invalid");
        e.target.parentElement.querySelector(".error-message").style.display = "block";
    };
})(), true);

// remove error message if field has been editted
recipeInputForm.addEventListener("input", function(e) {
    if(e.target.classList.contains("invalid")) {
        e.target.classList.remove("invalid");
        e.target.parentElement.querySelector(".error-message").style.display = "none";
    }
});

// send edited recipe to server when user clicks "scale servings"
function sendRecipe() {
    if(cookie == undefined) {
        console.log("cookie unset");
        cookie = sessionStorage.id;
        console.log(cookie);
        console.log(sessionStorage.id);
        // return;
    }
    let jsonData = {
        name:undefined,
        recipeYield:undefined,
        prepTime:undefined,
        cookTime:undefined,
        totalTime:undefined,
        recipeIngredients:[],
        recipeInstructions:[],
        notes:[],
        url:undefined
    };
    
    jsonData.name = document.getElementsByName("title")[0].value;
    jsonData.recipeYield = document.getElementsByName("servings")[0].value;
    jsonData.prepTime = document.getElementsByName("prep time")[0].value;
    jsonData.cookTime = document.getElementsByName("cook time")[0].value;
    jsonData.totalTime = document.getElementsByName("total time")[0].value;
    jsonData.url = url;
    grabIngredients(jsonData);
    grabInstructions(jsonData);
    grabNotes(jsonData);

    let cookiedData = {
        writeModifiedRecipe: true,
        "cookie": cookie
    };
    cookiedData.recipe = jsonData;
    fetch('json/recipe.json', {
        method: "POST",
        body: JSON.stringify(cookiedData),
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
        window.location.href = 'scale_servings.html';
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

// add the instructions from instructions input on form into the json data
function grabInstructions(jsonData) {
    let lis = instructionsInput.querySelectorAll("li");
    let instructions = [];
    lis.forEach((li) => {
        instructions.push(li.innerHTML);
    });
    jsonData.recipeInstructions = instructions;
}

// add the notes from notes input on form into the json data
function grabNotes(jsonData) {
    let lis = document.getElementsByName("notes")[0].querySelectorAll("li");
    let notes = [];
    lis.forEach((li) => {
        notes.push(li.innerHTML);
    });
    jsonData.notes = notes;
}