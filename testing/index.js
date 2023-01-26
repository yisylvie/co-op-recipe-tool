"use strict";

var _recipeDataScraper = _interopRequireDefault(require("@jitl/recipe-data-scraper"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const urlForm = document.getElementById("submit");
const urlInput = document.getElementById("url");
urlForm.addEventListener('click', function (event) {
  event.preventDefault();
  console.log("click")

  fetchRecipe(urlInput.value);
});
async function fetchRecipe(url) {
  try {
    // pass a full url to a page that contains a recipe
    const recipe = await (0, _recipeDataScraper.default)(url);
    // res.json({
    //   recipe
    // });
    console.log("async")
    console.log(recipe);
  } catch (error) {
    // res.status(500).json({
    //   message: err.message
    // });
  }
}