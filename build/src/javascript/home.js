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

const urlInputForm = document.getElementById("url-input-form");

urlInputForm.addEventListener("submit", function(event){
    event.preventDefault();
	let url = document.getElementsByName("url")[0].value;
    sendUrl(url);
}, false);

function sendUrl(url) {
    let jsonData;
    const data = { "fetchRecipeFromUrl": true, "url": url, "cookie": getCookie("PHPSESSID")};
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
    
    // fetch('http://localhost:8000/php/getRecipeFromUrl.php', {
    //     method: "POST",
    //     // mode: 'no-cors',
    //     body: JSON.stringify(data),
    //     headers: { 'content-type': 'application/json', 
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
    //     "Access-Control-Allow-Headers": "*"
    //     }
    // })
    // .then(response => response.json())
    // .then(data => {console.log(data); jsonData = data; sent();})
    // .catch(err => console.error(err));
    
    function sent() {
        window.location.href = 'create_recipe.html';
    }
}