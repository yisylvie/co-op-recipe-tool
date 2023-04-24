let rounding_values = {
    0: {
        min: 0,
        max: 0.11
    },
    .25: {
        min: 0.12,
        max: 0.28,
        frac: "&frac14;",
    },
    .33: {
        min: 0.29,
        max: 0.43,
        frac: "&frac13;",
    },
    .5: {
        min: 0.44,
        max: 0.58,
        frac: "&frac12;",
    },
    .67: {
        min: 0.59,
        max: 0.7,
        frac: "&frac23;",
    },
    .75: {
        min: 0.71,
        max: 0.85,
        frac: "&frac34;",
    },
    1: {
        min: 0.86,
        max: 1,
    }
};

// increase number of servings by amount and scale ingredients accordingly
function alterIngredients() {
    let prevServings = JSON.parse(JSON.stringify(originalServings.quantity));
    let copy = JSON.parse(JSON.stringify(scaledServings.quantity));
    let scaleFactor = copy / prevServings;

    for (let i = 0; i < originalIngredientsArray.length; i++) {
        if(originalIngredientsArray[i].quantity != null) {
            scaledIngredientsArray[i].quantity = originalIngredientsArray[i].quantity * scaleFactor;
        }
    }

    ingredientsInput.innerHTML = "";
    ul = document.createElement("ul");
    scaledIngredientsArray.forEach((ingredient) => {
        let li = document.createElement("li");
        li.innerHTML = prettify(ingredient);
        ul.appendChild(li);
    });
    ingredientsInput.appendChild(ul);
    resizeServings();
    ingredientsInput.querySelector("ul").style.width = getTrueWidth(originalIngredients.querySelector("ul")) + "px";
}

// format ingredient from ingredient object into viewable string
function prettify(ingredient, isServing = false) {
    if(isServing) {
        console.log(scaledServings.description);

        scaledServings.description = scaledServings.description.replace(/^\.*\d+/, "");
        // scaled servings to 3 decimal points
        return parseFloat(Number(scaledServings.quantity).toFixed(3)) + " " + scaledServings.description;
    } 
    
    // round numbers and remove numbers in the description
    if(ingredient.quantity != null) {
        let unrounded = ingredient.quantity;
        let decimal = unrounded % 1;
        decimal = decimal.toFixed(2);
        let wholeNumber = Math.trunc(unrounded);
        let prettyNumber;
        
        for (let fraction in rounding_values) {
            if(decimal >= rounding_values[fraction].min && decimal <= rounding_values[fraction].max) {
                if(rounding_values[fraction].max == 1) {
                    wholeNumber ++;
                }
                console.log(fraction + " " + rounding_values[fraction].frac);
                decimal = parseFloat(fraction);
                if(rounding_values[fraction].frac && wholeNumber != 0) {
                    prettyNumber = wholeNumber + " " + rounding_values[fraction].frac;
                } else if(rounding_values[fraction].frac) {
                    prettyNumber = rounding_values[fraction].frac;
                } else {
                    prettyNumber = wholeNumber;
                }        
            }
        }
    
        if(ingredient.unitOfMeasure) {
            return prettyNumber + " " + ingredient.unitOfMeasure + " " + ingredient.description;
        }
        return prettyNumber + " " + ingredient.description;
    }
    if(ingredient.unitOfMeasure) {
        return ingredient.unitOfMeasure + " " + ingredient.description;
    }
    return ingredient.description;
}