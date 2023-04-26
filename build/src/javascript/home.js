const urlInputForm = document.getElementById("url-input-form");
const inputManuallyButton = document.getElementById("input-manually-button");
const submitUrlButton = document.getElementById("submit-url-button");
const errorMessage = document.getElementsByClassName("error-message");
const loading = document.getElementsByClassName("loading");
const urlInput = document.getElementsByName("url")[0];
let timedOut = false;
let urlFocused = false;
const suggestedRecipes = document.querySelectorAll("#suggested-recipe-div>div>a");

// check that the cookie is set before clearing data
if(cookie == undefined) {
    grabCookie().then(
        function(value) {clearRecipeData();},
        function(error) {console.log(error);}
    );
} else {
    clearRecipeData();
}

urlInputForm.addEventListener("submit", function(event){
    event.preventDefault();
}, false);

// send url to server unless it is an invalid url then show error message
setClickListener(submitUrlButton, function(event){
    clearRecipeData();
    timedOut = false;
    let url = urlInput.value;
    if(isValidHttpUrl(url)) {
        // add fetching recipe/change button styling
        loading[0].innerHTML = "Fetching Recipe Data";
        errorMessage[0].style.display = "none";
        loading[0].style.display = "block";
        inputManuallyButton.classList.remove("primary-button");
        inputManuallyButton.classList.add("secondary-button");
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
        errorMessage[0].innerHTML = "Invalid URL (URL must begin with http or https). Try another or"
        errorMessage[0].style.display = "block";
        loading[0].style.display = "none";
        inputManuallyButton.classList.add("primary-button");
        inputManuallyButton.classList.remove("secondary-button");
    }
});

// highlight text when clicking into url form
setClickListener(document, function(event) {
    if(!urlFocused && document.activeElement == urlInput) {
        console.log(document.activeElement);
        urlInput.select();
        urlFocused = true;
    } else if(document.activeElement != urlInput){
        urlFocused = false;
    }
});

// go to one of the suggested recipes
suggestedRecipes.forEach((recipe) => {
    setClickListener(recipe, function(event){
        event.preventDefault();
        recipe.classList.add("loading-spin");
        clearRecipeData();
        timedOut = false;
        let url = recipe.href;
        // if the cookie is unset grab it first
        if(cookie == undefined) {
            grabCookie().then(
                function(value) {sendUrl(url);},
                function(error) {console.log(error);}
            );
        } else {
            sendUrl(url);
        }
    });
});

// redirect to create recipe on manual input click
setClickListener(inputManuallyButton, function(event){
    urlFocused = false;
    if(cookie == undefined) {
        grabCookie().then(
            function(value) {clearRecipeData();},
            function(error) {console.log(error);}
        );
    } else {
        clearRecipeData();
    }
    window.location.href = 'create_recipe.html';
});

function sendUrl(url) {
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
        recieveRecipe();
    }
}

// grab recipe from json/recipe.json and check if url was a valid recipe before redirect
function recieveRecipe() {
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
                errorMessage[0].innerHTML = "We couldn&#8217;t find a recipe at that link. Try another or"
                loading[0].style.display = "none";
                errorMessage[0].style.display = "block";
                inputManuallyButton.classList.add("primary-button");
                inputManuallyButton.classList.remove("secondary-button");
            } else {
                // recipe received; redirect
                loading[0].style.display = "none";
                document.querySelectorAll('.loading-spin').forEach(function(element) {
                    element.classList.remove("loading-spin");
                });
                urlFocused = false;
                window.location.href = 'create_recipe.html';
            }
        } else {
            if(!timedOut) {
                // recieveRecipe();
                // setInterval(function () {recieveRecipe();}, 100);

                setTimeout(function(){recieveRecipe();},100);
            }
        }
    }
}