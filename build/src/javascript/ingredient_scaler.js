// ParseIngredient.parseIngredient("3 eggs", {
//     additionalUOMs: {
//         egg: {
//             alternates: ["large eggs", "small eggs"],
//             short: "egg",
//             plural: "eggs"
//         }
// }});

let rounding_values_thirds = {
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

let rounding_values_quarters = {
    0: {
        min: 0,
        max: 0.11
    },
    .25: {
        min: 0.12,
        max: 0.38,
        frac: "&frac14;",
    },
    .5: {
        min: 0.39,
        max: 0.63,
        frac: "&frac12;",
    },
    .75: {
        min: 0.64,
        max: 0.88,
        frac: "&frac34;",
    },
    1: {
        min: 0.89,
        max: 1,
    }
};

let convert_values = {
    drop: {
        max_convert: {
            max: 7,
            dash: 1/10
        },
        round: true
    },
    pinch: {
        max_convert: {
            max: 2,
            dash: 1/2,
        },
        round: true
    },
    dash: {
        max_convert: {
            max: 2,
            teaspoon: 1/8,
        },
        round: true
    },
    teaspoon: {
        max_convert: {
            max: 2.5,
            tablespoon: 1/3
        },
        round: "rounding_values_quarters"
    },
    tablespoon: {
        max_convert: {
            max: 4,
            cup: 1/16
        },
        min_convert: {
            min: 5/6,
            teaspoon: 3
        },  
        round: true
    },
    cup: {
        max_convert: {
            max: 13,
            quart: 1/4
        },
        min_convert: {
            min: 1/4, 
            tablespoon: 16
        },
        round: "rounding_values_thirds"
    },
    quart: {
        max_convert: {
            max: 18,
            gallon: 1/4
        },
        min_convert: {
            min: 3.25,
            cup: 4
        },
        round: "rounding_values_thirds"
    },    
    gallon: {
        min_convert: {
            min: 4.5,
            quart: 4
        },
        round: "rounding_values_thirds"
    }
}    

let always_round = [
    "egg",
    "eggs",
    // "basil",
    // "brussels sprout",
    // "collard green",
    "garlic",
    "bay leaf",
    "bay leaves",
    "garlic cloves",
    "garlic clove",
    "of garlic",
    // "green bean",
    // "green beans",
    // "bilberry",
    // "blackberry",
    // "blackcurrant",
    // "blueberry",
    // "boysenberry",
    // "cherry",
    // "clementine",
    // "cranberry",
    // "elderberry",
    // "fig",
    // "goji berry",
    // "gooseberry",
    // "grape",
    // "huckleberry",
    // "lemon",
    // "lime",
    // "lychee",
    // "mulberry",
    // "nut",
    // "olive",
    // "raisin",
    // "rambutan",
    // "raspberry",
    // "redcurrant",
    // "salal berry",
    // "strawberry"
]

let vegetables_and_fruit = [
        "acorn squash",
        "alfalfa sprout",
        "amaranth",
        "anise",
        "artichoke",
        "arugula",
        "asparagus",
        "aubergine",
        "azuki bean",
        "banana squash",
        "basil",
        "bean sprout",
        "beet",
        "black bean",
        "black-eyed pea",
        "bok choy",
        "borlotti bean",
        "broad beans",
        "broccoflower",
        "broccoli",
        "brussels sprout",
        "butternut squash",
        "cabbage",
        "calabrese",
        "caraway",
        "carrot",
        "cauliflower",
        "cayenne pepper",
        "celeriac",
        "celery",
        "chamomile",
        "chard",
        "chayote",
        "chickpea",
        "chives",
        "cilantro",
        "collard green",
        "corn",
        "corn salad",
        "courgette",
        "cucumber",
        "daikon",
        "delicata",
        "dill",
        "eggplant",
        "endive",
        "fennel",
        "fiddlehead",
        "frisee",
        "garlic",
        "gem squash",
        "ginger",
        "green bean",
        "green pepper",
        "habanero",
        "herbs and spice",
        "horseradish",
        "hubbard squash",
        "jalapeno",
        "jerusalem artichoke",
        "jicama",
        "kale",
        "kidney bean",
        "kohlrabi",
        "lavender",
        "leek ",
        "legume",
        "lemon grass",
        "lentils",
        "lettuce",
        "lima bean",
        "mamey",
        "mangetout",
        "marjoram",
        "mung bean",
        "mushroom",
        "mustard green",
        "navy bean",
        "new zealand spinach",
        "nopale",
        "okra",
        "onion",
        "oregano",
        "paprika",
        "parsley",
        "parsnip",
        "patty pan",
        "pea",
        "pinto bean",
        "potato",
        "pumpkin",
        "radicchio",
        "radish",
        "rhubarb",
        "rosemary",
        "runner bean",
        "rutabaga",
        "sage",
        "scallion",
        "shallot",
        "skirret",
        "snap pea",
        "soy bean",
        "spaghetti squash",
        "spinach",
        "squash",
        "sweet potato",
        "tabasco pepper",
        "taro",
        "tat soi",
        "thyme",
        "topinambur",
        "tubers",
        "turnip",
        "wasabi",
        "water chestnut",
        "watercress",
        "white radish",
        "yam",
        "zucchini",
        "apple",
        "apricot",
        "avocado",
        "banana",
        "bell pepper",
        "bilberry",
        "blackberry",
        "blackcurrant",
        "blood orange",
        "blueberry",
        "boysenberry",
        "breadfruit",
        "canary melon",
        "cantaloupe",
        "cherimoya",
        "cherry",
        "chili pepper",
        "clementine",
        "cloudberry",
        "coconut",
        "cranberry",
        "cucumber",
        "currant",
        "damson",
        "date",
        "dragonfruit",
        "durian",
        "eggplant",
        "elderberry",
        "feijoa",
        "fig",
        "goji berry",
        "gooseberry",
        "grape",
        "grapefruit",
        "guava",
        "honeydew",
        "huckleberry",
        "jackfruit",
        "jambul",
        "jujube",
        "kiwi fruit",
        "kumquat",
        "lemon",
        "lime",
        "loquat",
        "lychee",
        "mandarine",
        "mango",
        "mulberry",
        "nectarine",
        "nut",
        "olive",
        "orange",
        "papaya",
        "passionfruit",
        "peach",
        "pear",
        "persimmon",
        "physalis",
        "pineapple",
        "plum",
        "pomegranate",
        "pomelo",
        "purple mangosteen",
        "quince",
        "raisin",
        "rambutan",
        "raspberry",
        "redcurrant",
        "rock melon",
        "salal berry",
        "satsuma",
        "star fruit",
        "strawberry",
        "tamarillo",
        "tangerine",
        "tomato",
        "ugli fruit",
        "watermelon"
]

// increase number of servings by amount and scale ingredients accordingly
function alterIngredients() {
    console.log(originalIngredientsArray);
    let prevServings = JSON.parse(JSON.stringify(originalServings.quantity));
    let copy = JSON.parse(JSON.stringify(scaledServings.quantity));
    let scaleFactor = copy / prevServings;

    for (let i = 0; i < originalIngredientsArray.length; i++) {
        if(originalIngredientsArray[i].quantity == null) {
            let firstWord = originalIngredientsArray[i].description.replace(/ .*/,'').toLowerCase();
            let number = text2num(firstWord);
            if(number != 0) {
                originalIngredientsArray[i].quantity = number;
                originalIngredientsArray[i].description = originalIngredientsArray[i].description.match(/ .*/)[0];
                scaledIngredientsArray[i].description = originalIngredientsArray[i].description.match(/ .*/)[0];
            }
        }
        if(originalIngredientsArray[i].quantity != null) {
            // average ingredient if in form "2 - 3 unit"
            if(originalIngredientsArray[i].quantity2) {
                originalIngredientsArray[i].quantity = (originalIngredientsArray[i].quantity + originalIngredientsArray[i].quantity2) / 2;
                console.log(originalIngredientsArray[i].quantity);
            }
            scaledIngredientsArray[i].quantity = originalIngredientsArray[i].quantity * scaleFactor;
            scaledIngredientsArray[i].unitOfMeasure = originalIngredientsArray[i].unitOfMeasure;
            scaledIngredientsArray[i].unitOfMeasureID = originalIngredientsArray[i].unitOfMeasureID;
            convert(scaledIngredientsArray[i]);
        }
    }

    ul = document.createElement("ul");
    let i = 0;
    scaledIngredientsArray.forEach((ingredient) => {
        let li = document.createElement("li");
        li.innerHTML = prettify(ingredient);
        // if(document.getElementById(i + "_input_li").innerHTML != li.innerHTML) {
        //     // li.classList.add("altered_li");
        //     // li.addEventListener('animationend', function(){
        //     //     li.classList.remove("altered_li");
        //     // });
        // }
        li.id = i + "_input_li"
        ul.appendChild(li);
        i++;
    });
    ingredientsInput.innerHTML = "";
    // let scaleIngredientsDiv = document.querySelector("#scale-ingredients");
    // if ingredients stuff is not in view make reminder div visible
    if(scaledServings.quantity != originalServings.quantity && document.querySelector("#reminderDiv").style.display != "flex") {
        document.querySelector("#reminderDiv").style.display = "flex";

        // if instructions are > 50% in view, show reminder without scroll stuff
        if(checkFifty(document.querySelector("#instructions-input"))) {
            document.querySelector("#reminderDiv svg").remove();
            document.querySelector("#reminderDiv .reminder").style.cursor = "unset";
            document.querySelector("#reminderDiv h4").innerHTML = document.querySelector("#reminderDiv .reminder p").innerHTML;
            document.querySelector("#reminderDiv .reminder p").remove();
            document.querySelector("#reminderDiv .reminder div h4").style.width = getTrueWidth(document.querySelector("#reminderDiv .reminder h4"))/2 + 4 + "px";
            
            // make it not clickable
            setClickListener(document.querySelector("#reminderDiv"), function (event) {
                event.preventDefault();
            });
        } else {
            // disappear reminder when scrolled to section
            setClickListener(document.querySelector("#reminderDiv"), function (event) {
                this.style.display = "none";
            });
        }
        document.querySelector("#reminderDiv .reminder").classList.add("triggered");
    } 
    ingredientsInput.appendChild(ul);
    resizeServings();
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

        // check how we should round
        let rounding_values;

        if(ingredient.unitOfMeasureID in convert_values) {
            if(convert_values[ingredient.unitOfMeasureID].round == "rounding_values_thirds") {
                rounding_values = rounding_values_thirds;
            } else {
                rounding_values = rounding_values_quarters;
            }
        } else {
            rounding_values = rounding_values_quarters;
        }
        
        for (let fraction in rounding_values) {
            // if we can round to this value
            if(decimal >= rounding_values[fraction].min && decimal <= rounding_values[fraction].max) {
                // if it rounds up to 1 add to whole number value
                if(rounding_values[fraction].max == 1) {
                    wholeNumber ++;
                }
                decimal = parseFloat(fraction);
                if(rounding_values[fraction].frac && wholeNumber != 0) {
                    prettyNumber = wholeNumber + " " + rounding_values[fraction].frac;
                } else if(rounding_values[fraction].frac) {
                    prettyNumber = rounding_values[fraction].frac;
                } else {
                    prettyNumber = wholeNumber;
                }

                // convert plural
                if(ParseIngredient.unitsOfMeasure[ingredient.unitOfMeasureID]) {
                    if(rounding_values[fraction].frac || wholeNumber != 1) {
                    // if(wholeNumber != 1 || decimal > 0 || decimal < 1) {
                        ingredient.unitOfMeasure = ParseIngredient.unitsOfMeasure[ingredient.unitOfMeasureID].plural;
                    } else {
                        console.log(ParseIngredient.unitsOfMeasure[ingredient.unitOfMeasureID]);
                        ingredient.unitOfMeasure = ingredient.unitOfMeasureID;
                    }  
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


// convert ingredients between units
function convert(ingredient) {
    // iterate through convert_values to check for if can convert to larger unit
    for (const unit in convert_values) {
        if(ingredient.unitOfMeasureID == unit && convert_values[unit].max_convert) {
            if(ingredient.quantity >= convert_values[unit].max_convert.max) {
                for(conversion in convert_values[unit].max_convert) {
                    if(conversion != "max") {
                        console.log (convert_values[unit].max_convert[conversion]);
                        ingredient.quantity = ingredient.quantity * convert_values[unit].max_convert[conversion];
                        ingredient.unitOfMeasure = conversion;
                        ingredient.unitOfMeasureID = conversion;
                    } 
                }
            }
        }
    }

    // iterate through convert_values backwards to check for if can convert to smaller unit
    const backwardsUnits = Object.keys(convert_values).reverse();
    backwardsUnits.forEach(backwardsUnit => {
        if(ingredient.unitOfMeasureID == backwardsUnit && convert_values[backwardsUnit].min_convert) {
            if(ingredient.quantity < convert_values[backwardsUnit].min_convert.min) {
                for(conversion in convert_values[backwardsUnit].min_convert) {
                    if(conversion != "min") {
                        console.log (convert_values[backwardsUnit].min_convert[conversion]);
                        ingredient.quantity = ingredient.quantity * convert_values[backwardsUnit].min_convert[conversion];
                        ingredient.unitOfMeasure = conversion;
                        ingredient.unitOfMeasureID = conversion;
                    } 
                }
            }
        }
    });

    // round to nearest whole value if round == true
    if(convert_values[ingredient.unitOfMeasureID]) {
        if(convert_values[ingredient.unitOfMeasureID].round == true) {
            ingredient.quantity = parseFloat(Number(ingredient.quantity).toFixed());
            console.log(ingredient.quantity);
        }
    }

    // round to nearest whole value if this ingredient is in always_round list
    let firstWord = ingredient.description.replace(/ .*/,'').toLowerCase();
    console.log(firstWord);
    if(always_round.includes(firstWord) && (ingredient.unitOfMeasureID == null) || (ingredient.unitOfMeasureID == "medium" || (ingredient.unitOfMeasureID == "large") || (ingredient.unitOfMeasureID == "small") || ingredient.unitOfMeasureID == "clove")) {
        ingredient.quantity = parseFloat(Number(ingredient.quantity).toFixed());
        console.log(ingredient);
    }
}