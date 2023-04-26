const upButton = document.getElementById("scale-up-button");
const downButton = document.getElementById("scale-down-button");
const ingredientsList = document.getElementById("ingredients-list");
const copyIcon = document.getElementById("copy-button");
const editIcon = document.getElementById("edit-button");
const printIcon = document.getElementById("print-button");
const instructionsList = document.getElementById("instructions-list");
const timesDiv = document.getElementById("times-div");

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
            document.title = jsonData.name;
            document.getElementById("servings").innerHTML = "Makes: " + jsonData.recipeYield;
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
    const ol = instructionsList;
    ol.innerHTML = "";
    instructions.forEach((instruction) => {
        let li = document.createElement("li");
        li.innerHTML = instruction;
        ol.appendChild(li);
    });
}

function appendTimes(jsonData) {
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

// copy recipe to clipboard when copy icon clicked
setClickListener(copyIcon, function(event){
    event.preventDefault();
    try {
        // remove edit and copy buttons from copy field
        mainCopy = document.getElementsByClassName("main")[0].cloneNode(true);
        mainCopy.classList = "main-copy";
        console.log(mainCopy.querySelector(".main-copy #edit-export"));
        mainCopy.querySelector(".main-copy #edit-export").remove();
        console.log(mainCopy);
        const content = mainCopy.innerHTML;
        const blobInput = new Blob([content], {type: 'text/html'});
        const clipboardItemInput = new ClipboardItem({'text/html' : blobInput});
        navigator.clipboard.write([clipboardItemInput]);
        copyIcon.classList.add("copied");
        copyIcon.addEventListener('animationend', function(){
            copyIcon.classList.remove("copied");
        });
    } catch(e) {
        // Handle error with user feedback - "Copy failed!" kind of thing
        console.log(e);
    }
});

// print when print button clicked
setClickListener(printIcon, function(event){
    event.preventDefault();
    // remove edit and copy buttons from copy field and original recipe link
    mainCopy = document.getElementsByClassName("main")[0].cloneNode(true);
    mainCopy.classList = "main-copy";
    console.log(mainCopy.querySelector(".main-copy #edit-export"));
    mainCopy.querySelector(".main-copy #edit-export").remove();
    mainCopy.querySelector(".main-copy #original-recipe-link").remove();
    mainCopy.classList = "main";
    printElement(mainCopy);
});

// redirect to review recipe when edit icon clicked
setClickListener(editIcon, function(event){
    event.preventDefault();
    window.location.href = "create_recipe.html";
});

// var oldURL = document.referrer;
// console.log(oldURL);
// var elem = window;
// function openFullscreen() {
//   if (elem.requestFullscreen) {
//     elem.requestFullscreen();
//   } else if (elem.webkitRequestFullscreen) { /* Safari */
//     elem.webkitRequestFullscreen();
//   } else if (elem.msRequestFullscreen) { /* IE11 */
//     elem.msRequestFullscreen();
//   }
// }

// stole from https://stackoverflow.com/questions/6500962/how-to-print-only-a-selected-html-element
function printElement(e) {
    let cloned = e.cloneNode(true);
    document.body.appendChild(cloned);
    cloned.classList.add("printable");
    window.print();
    document.body.removeChild(cloned);
}
