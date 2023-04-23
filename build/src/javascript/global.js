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

// try to get the cookie every 20 milliseconds until it is set or 5 seconds have past
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
// function clearRecipeData() {
//     const data = { "clearRecipe": true, "cookie": cookie};
//     fetch('json/recipe.json', {
//         method: "POST",
//         body: JSON.stringify(data),
//         headers: { 'content-type': 'application/json', 
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
//         "Access-Control-Allow-Headers": "*"
//         }
//     })
//     .then(response => response.json())
//     .then(data => {console.log(data); jsonData = data; sent();})
//     .catch(err => console.error(err));
//     function sent() {
//         // window.location.href = 'create_recipe.html';
//         console.log("data cleared");
//     }
// }