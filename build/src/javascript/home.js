const urlInputForm = document.getElementById("url-input-form");
const inputManuallyButton = document.getElementById("input-manually-button");
const submitUrlButton = document.getElementById("submit-url-button");
const errorMessage = document.getElementsByClassName("error-message");
const loading = document.getElementsByClassName("loading");
let timedOut = false;

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
    let url = document.getElementsByName("url")[0].value;
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
        errorMessage[0].innerHTML = "Invalid URL (URL must begin with http or https). Try another or"
        errorMessage[0].style.display = "block";
        loading[0].style.display = "none";
        inputManuallyButton.classList.add("primary-button");
        inputManuallyButton.classList.remove("secondary-button");
    }
});

// redirect to create recipe on manual input click
setClickListener(inputManuallyButton, function(event){
    window.location.href = 'create_recipe.html';
});

function sendUrl(url) {
    loading[0].innerHTML = "Fetching Recipe Data";
    errorMessage[0].style.display = "none";
    loading[0].style.display = "block";
    inputManuallyButton.classList.remove("primary-button");
    inputManuallyButton.classList.add("secondary-button");
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
            if(jsonData[cookie] == "Could not find recipe data") {
                errorMessage[0].classList.remove("loading");
                errorMessage[0].innerHTML = "We couldn&#8217;t find a recipe at that link. Try another or"
                loading[0].style.display = "none";
                errorMessage[0].style.display = "block";
                inputManuallyButton.classList.add("primary-button");
                inputManuallyButton.classList.remove("secondary-button");
            } else {
                loading[0].style.display = "none";
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