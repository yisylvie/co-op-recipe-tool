let url;

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
            jsonData = jsonData[cookie];
            if("name" in jsonData) {
                document.getElementsByName("title")[0].value = jsonData.name;
            }
            if("recipeYield" in jsonData) {
                document.getElementsByName("servings")[0].value = jsonData.recipeYield;
            }
            if("prepTime" in jsonData) {
                document.getElementsByName("prep time")[0].value = jsonData.prepTime;
            }
            if("cookTime" in jsonData) {
                document.getElementsByName("cook time")[0].value = jsonData.cookTime;
            }
            if("totalTime" in jsonData) {
                document.getElementsByName("total time")[0].value = jsonData.totalTime;
            }
            url = jsonData.url;
            if("recipeIngredients" in jsonData) {
                appendIngredients(jsonData.recipeIngredients);
            }
            if("recipeInstructions" in jsonData) {
                appendInstructions(jsonData.recipeInstructions);
            }
        }
    }
}

recieveRecipe();

// add the ingredients from the json data into ingredients input on form
function appendIngredients(ingredients) {
    document.getElementsByName("ingredients")[0].innerHTML = "";
    let ul = document.createElement("ul");
    ingredients.forEach((ingredient) => {
        if(ingredient != null) {
            let li = document.createElement("li");
            li.innerHTML = ingredient;
            ul.appendChild(li);
        }
    });
    document.getElementsByName("ingredients")[0].appendChild(ul);
}

// add the instructions from the json data into instructions input on form
function appendInstructions(instructions) {
    document.getElementsByName("instructions")[0].innerHTML = "";
    let ol = document.createElement("ol");
    instructions.forEach((instruction) => {
        if(instruction != null) {
            let li = document.createElement("li");
            li.innerHTML = instruction;
            ol.appendChild(li);
        }
    });
    document.getElementsByName("instructions")[0].appendChild(ol);
}

const recipeInputForm = document.getElementById("recipe-input-form");

recipeInputForm.addEventListener("submit", function(e) {
    e.preventDefault();
    sendRecipe();
});

// send edited recipe to server when user clicks "scale servings"
function sendRecipe() {
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
    let lis = document.getElementsByName("ingredients")[0].querySelectorAll("li");
    let ingredients = [];
    lis.forEach((li) => {
        ingredients.push(li.innerHTML);
    });
    jsonData.recipeIngredients = ingredients;
}

// add the instructions from instructions input on form into the json data
function grabInstructions(jsonData) {
    let lis = document.getElementsByName("instructions")[0].querySelectorAll("li");
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