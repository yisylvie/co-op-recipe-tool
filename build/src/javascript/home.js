const urlInputForm = document.getElementById("url-input-form");

urlInputForm.addEventListener("submit", function(event){
    event.preventDefault();
	let url = document.getElementsByName("url")[0].value;
    sendUrl(url);
}, false);

function sendUrl(url) {
    let jsonData;
    const data = { "fetchRecipeFromUrl": true, "url": url};
    fetch('json/recipe.json', {
        method: "POST",
        // mode: 'no-cors',
        // credentials:"include",
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
    
    // fetch('http://localhost:8000/php/recipe.php', {
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