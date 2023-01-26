let recipeInput = document.getElementById("input");
let recipeOutput = document.getElementById("output");
let urlForm = document.getElementById("urlForm");
let url = document.getElementById("url");

// require the core node events module
let slicer = require('recipe-slicer');

//create a new event emitter
let Recipe = new slicer.Recipe;

recipeInput.addEventListener("input", function(event) {
    let input = recipeInput.value;
    changeOutput(input);
    // fetchIngredients(input);
});

function changeOutput(input) {
    Recipe.set(input);
    Recipe.scale(3);
    recipeOutput.value = input + "asdfasdf   1 can (10 1/2 ounces) Campbell's® Condensed Cream of Mushroom Soup    asdfasdf🏵";
    console.log(input)
}

// urlForm.addEventListener('submit', function(event) {
//     event.preventDefault();
//     fetchRecipe(url.value);
// })

// function fetchRecipe(url){
//     let jsonData;
//     let apiUrl = "https://api.spoonacular.com/recipes/extract";
//     let APIkey = "9017230fb32f4ed7ab349e9a967231a9";
//     apiUrl += "?apiKey=" + APIkey;
//     apiUrl += "&url=" + url;

//     fetch(apiUrl, {
//       method: "GET",
//     })
//     .then(res => res.json())
//     .then(data => {jsonData = data; console.log(data); displayData()})
//     .catch(error => console.error('Error:',error))

//     function displayData() {
      
//     }
// }

// function fetchIngredients(ingredients){
//     let jsonData;
//     let apiUrl = "https://api.spoonacular.com/recipes/parseIngredients";
//     let APIkey = "9017230fb32f4ed7ab349e9a967231a9";
//     apiUrl += "?apiKey=" + APIkey;
//     let ingredientList = ingredients;
//     // const data = { 'ingredientList' : ingredientList };
//     apiUrl += "&ingredientList=" + ingredientList;
//     fetch(apiUrl, {
//       method: "POST",
//     //   body: JSON.stringify(data),
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded"
//       }
//     })
//     .then(res => res.json())
//     .then(data => {jsonData = data; console.log(data); displayData()})
//     .catch(error => console.error('Error:',error))

//     function displayData() {
      
//     }
// }