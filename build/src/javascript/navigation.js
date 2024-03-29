// const urlInput = document.getElementsByName("url")[0];
const nav = document.querySelector("nav");
const urlInputForm = document.getElementById("url-input-form");
const inputManuallyButton = document.getElementById("input-manually-button");
const submitUrlButton = document.getElementById("submit-url-button");
const errorMessage = document.getElementsByClassName("error-message");
const loading = document.getElementsByClassName("loading");
const urlInput = document.getElementsByName("url")[0];
let timedOut = false;
let urlFocused = false;

let manualInputLink = document.createElement("a");
manualInputLink.href = "create_recipe.html";
manualInputLink.innerHTML = "input manually."
// const urlInputForm = document.getElementById("url-input-form");

// highlight text when clicking into url form
setClickListener(document, function(event) {
    if(nav.id != "focused-nav" && document.activeElement == urlInput) {
        nav.setAttribute("id", "focused-nav");
        urlInput.select();
    } else if(!nav.contains(event.target)) {
        nav.removeAttribute("id");
    }
});

urlInputForm.addEventListener("submit", function(event){
    event.preventDefault();
}, false);

// send url to server unless it is an invalid url then show error message
setClickListener(submitUrlButton, function(event){
    clearRecipeData();
    timedOut = false;
    let url = urlInput.value;
    if(isValidHttpUrl(url)) {
        // if the cookie is unset grab it first
        if(cookie == undefined) {
            grabCookie().then(
                function(value) {sendUrl(url);},
                function(error) {console.log(error);}
            );
        } else {
            sendUrl(url);
        }
    } else {
        if(url == "") {
            errorMessage[0].innerHTML = "Input a recipe url or "
        } else {
            errorMessage[0].innerHTML = "Invalid URL (URL must begin with http or https). Try another or "
        }
        errorMessage[0].append(manualInputLink);
        // errorMessage[0].innerHTML = "Invalid URL (URL must begin with http or https). Try another or input manually."
        errorMessage[0].style.display = "block";
        loading[0].style.display = "none";
    }
});

// redirect to create recipe on manual input click
setClickListener(inputManuallyButton, function(event){
    urlFocused = false;
    clearModifiedRecipeData();
    window.location.href = 'create_recipe.html';
});

// redirect to create recipe on manual input click
setClickListener(manualInputLink, function(event){
    urlFocused = false;
    clearModifiedRecipeData();
    window.location.href = 'create_recipe.html';
});

function sendUrl(url) {
    // add fetching recipe/change button styling
    loading[0].innerHTML = "Fetching Recipe Data";
    errorMessage[0].style.display = "none";
    loading[0].style.display = "block";
    const data = { "fetchRecipeFromUrl": true, "url": url, "cookie": cookie};
    fetch('json/recipe.json', {
        method: "POST",
        body: JSON.stringify(data),
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
        setTimeout(function(){timedOut = true; console.log("timed out getting recipe") },8000);
        receiveNavRecipe();
    }
}

// // grab recipe from json/recipe.json and check if url was a valid recipe before redirect
function receiveNavRecipe() {
    console.log("what the fuck");
    let jsonData;
    // const data = { "fetchNewRecipe": true};
    fetch('json/recipe.json', {
        method: "POST",
        // body: JSON.stringify(data),
        credentials:"same-origin",
    })
    .then(response => response.json())
    .then(data => {console.log(data); jsonData = data; sent();})
    .catch(err => console.error(err));
    
    function sent() {
        if(cookie in jsonData) {
            // if there was no recipe
            if(jsonData[cookie] == "Could not find recipe data") {
                errorMessage[0].classList.remove("loading");
                errorMessage[0].innerHTML = "We couldn&#8217;t find a recipe at that link. Try another or "
                errorMessage[0].append(manualInputLink);
                loading[0].style.display = "none";
                errorMessage[0].style.display = "block";
            } else {
                jsonData = jsonData[cookie];
                sendRecipe(jsonData.name, jsonData.recipeYield, jsonData.prepTime, jsonData.cookTime, jsonData.totalTime, jsonData.url, jsonData.recipeIngredients, jsonData.recipeInstructions);
                loading[0].style.display = "none";
                urlFocused = false;
                // recipe received; redirect
                window.location.href = 'create_recipe.html';
            }
        } else {
            if(!timedOut) {
                setTimeout(function(){receiveNavRecipe();},100);
            }
        }
    }
}