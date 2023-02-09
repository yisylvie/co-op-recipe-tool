const url_form = document.getElementById("recipe-url-form");

url_form.addEventListener('submit', function(event) {
    event.preventDefault();
    window.location.href = 'recipe.html';
})
