// // prevent user from opening multiple tabs
// const channel = new BroadcastChannel('tab');

// channel.postMessage('another-tab');
// // note that listener is added after posting the message

// channel.addEventListener('message', (msg) => {
//   if (msg.data === 'another-tab') {
//     // message received from 2nd tab
//     alert('Cannot open multiple instances');
//     window.location.href = '404.html';
//   }
// });

// get the cookie value from the key cname
// from https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    let  name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue;
}

console.log(sessionStorage);
let cookie;

// try to get the cookie every 10 milliseconds until it is set or 5 seconds have past
async function grabCookie() {
    let myPromise = new Promise(function(resolve) {
        var grabbed = setInterval(function(){
            cookie = sessionStorage.id;
            console.log(sessionStorage);
            console.log(cookie);
            if(cookie != undefined) {
                clearInterval(grabbed);
                resolve("we got the cookie yay");
            }
        }, 10);
        setTimeout(function( ) { 
            clearInterval( grabbed ); 
            console.log("cookie grab timeout");
            if(cookie == undefined) {
                console.log("cookie was not grabbed before timeout");
                document.location.reload();
            }
        }, 5000);
    });
    console.log(await myPromise);
}

grabCookie();

// check if a url is actually a url
function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

// change html entities into their actual values
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

// listener to detect all possible changes in a contenteditable box
function setTextChangeListener (div, listener) {
    div.addEventListener("blur", listener);
    div.addEventListener("keyup", listener);
    div.addEventListener("paste", listener);
    div.addEventListener("copy", listener);
    div.addEventListener("cut", listener);
    div.addEventListener("delete", listener);
    div.addEventListener("mouseup", listener);
}

// listener to detect button click or keypress
function setClickListener (el, listener) {
    el.addEventListener("keypress", listener);
    el.addEventListener("click", listener);
}

// returns the height of an element excluding its padding
function getTrueHeight(element) {
    let computedStyle = getComputedStyle(element);
    let elementHeight = element.clientHeight;  // height with padding
    return elementHeight -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
}

// make html entities real symbols and collapse whitespace
function sterilize(text) {
    let sterilizedText = document.createElement("textarea");
    text = text.toString();
    sterilizedText.innerHTML = text.replace(/\s+/g, " ");
    return sterilizedText.value;
}

// returns the width of an element excluding its padding
function getTrueWidth(element) {
    let computedStyle = getComputedStyle(element);
    let elementWidth = element.clientWidth;   // width with padding
    return elementWidth -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
}

// check if an element exists
function elementExists(el) {
    return document.body.contains(el);
}

// tell the server to clear any recipe data for the current user
function clearRecipeData() {
    const data = { "clearRecipe": true, "cookie": cookie};
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
        // window.location.href = 'create_recipe.html';
        console.log("data cleared");
    }
}

// tell the server to clear any modified recipe data for the current user
function clearModifiedRecipeData() {
    const data = { "clearModifiedRecipe": true, "cookie": cookie};
    fetch('json/modified_recipe.json', {
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
        // window.location.href = 'create_recipe.html';
        console.log("modified data cleared");
    }
}

// send edited recipe to server
function sendRecipe(name, recipeYield, prepTime, cookTime, totalTime, url, recipeIngredients, recipeInstructions) {
    // let sentWell = false;
    if(cookie == undefined) {
        console.log("cookie unset");
        cookie = sessionStorage.id;
        console.log(cookie);
        console.log(sessionStorage.id);
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

    jsonData.name = name;
    jsonData.recipeYield = recipeYield;
    jsonData.prepTime = prepTime;
    jsonData.cookTime = cookTime;
    jsonData.totalTime = totalTime;
    
    
    // jsonData.name = document.getElementsByName("title")[0].value;
    // jsonData.recipeYield = document.getElementsByName("servings")[0].value;
    // jsonData.prepTime = document.getElementsByName("prep time")[0].value;
    // jsonData.cookTime = document.getElementsByName("cook time")[0].value;
    // jsonData.totalTime = document.getElementsByName("total time")[0].value;
    jsonData.url = url;
    jsonData.recipeInstructions = recipeInstructions;
    jsonData.recipeIngredients = recipeIngredients;
    // grabIngredients(jsonData);
    // grabInstructions(jsonData);
    // grabNotes(jsonData);

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
        // window.location.href = 'scale_servings.html';
        // window.location.href = nextPage;
        // sentWell = true;
        // return true;
    }
}

// add the ingredients from ingredients input on form into the json data
function grabIngredients() {
    let lis = ingredientsInput.querySelectorAll("li");
    let ingredients = [];
    lis.forEach((li) => {
        ingredients.push(li.innerHTML);
    });
    return ingredients;
}

// add the instructions from instructions input on form into the json data
function grabInstructions() {
    let lis = instructionsInput.querySelectorAll("li");
    let instructions = [];
    lis.forEach((li) => {
        instructions.push(li.innerHTML);
    });
    return instructions;
}

// https://stackoverflow.com/questions/3944122/detect-left-mouse-button-press
// detect if left click
function detectLeftButton(evt) {
    evt = evt || window.event;
    if ("buttons" in evt) {
        return evt.buttons == 1;
    }
    var button = evt.which || evt.button;
    return button == 1;
}

// check if element is either partially in viewport or the top of it has scrolled above the top of viewport
const elementIsVisibleInViewport = (el, partiallyVisible = false) => {
    const { top, left, bottom, right } = el.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    return partiallyVisible
      ? ((top > 0 && top < innerHeight) ||
          (bottom > 0 && bottom < innerHeight)) &&
          ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth))
      : top <= 0;
};

// https://stackoverflow.com/questions/64016225/how-to-check-if-element-is-half-visible-in-the-viewport-with-javascript
function checkFifty(el) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top + (rect.height/2) > 0 && // top
        rect.top + (rect.height/2) < (window.innerHeight || document.documentElement.clientHeight) // bottom
    );
}

// changing number words to actual numeral
var Small = {
    'zero': 0,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten': 10,
    'eleven': 11,
    'twelve': 12,
    'thirteen': 13,
    'fourteen': 14,
    'fifteen': 15,
    'sixteen': 16,
    'seventeen': 17,
    'eighteen': 18,
    'nineteen': 19,
    'twenty': 20,
    'thirty': 30,
    'forty': 40,
    'fifty': 50,
    'sixty': 60,
    'seventy': 70,
    'eighty': 80,
    'ninety': 90
};

var Magnitude = {
    'thousand':     1000,
    'million':      1000000,
    'billion':      1000000000,
    'trillion':     1000000000000,
    'quadrillion':  1000000000000000,
    'quintillion':  1000000000000000000,
    'sextillion':   1000000000000000000000,
    'septillion':   1000000000000000000000000,
    'octillion':    1000000000000000000000000000,
    'nonillion':    1000000000000000000000000000000,
    'decillion':    1000000000000000000000000000000000,
};

var a, n, g;

function text2num(s) {
    a = s.toString().split(/[\s-]+/);
    n = 0;
    g = 0;
    a.forEach(feach);
    return n + g;
}

function feach(w) {
    var x = Small[w];
    if (x != null) {
        g = g + x;
    }
    else if (w == "hundred") {
        g = g * 100;
    }
    else {
        x = Magnitude[w];
        if (x != null) {
            n = n + g * x
            g = 0;
        }
        else { 
            return false; 
        }
    }
}