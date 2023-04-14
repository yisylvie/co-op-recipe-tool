const unstuck = document.getElementsByClassName("unstuck");
const servings = document.getElementById("servings");
const servingsHidden = document.getElementById("servings-hidden");
const servingsHiddenStuck = document.getElementById("servings-hidden-stuck");
const timeInputs = document.getElementsByClassName("time-input");

var observer = new IntersectionObserver(function(entries) {
	// no intersection with screen
	if(entries[0].intersectionRatio === 0) {
        for (let i = 0; i < unstuck.length; i++) {
            unstuck[i].classList.add("stuck");
            unstuck[i].classList.remove("unstuck");
        }
        resizeServings();
    }

	// fully intersects with screen
	else if(entries[0].intersectionRatio === 1) {
        const stuck = document.getElementsByClassName("stuck");
    	for (let i = 0; i < stuck.length; i++) {
            stuck[i].classList.add("unstuck");
            stuck[i].classList.remove("stuck");
        }
        // console.log("unstuck");
        resizeServings();
    }
}, { threshold: [0,1] });

observer.observe(document.querySelector("#stuck-top"));

// make it so users can only paste plain text
document.querySelectorAll("div[contenteditable]").forEach((contenteditable) => {
    contenteditable.addEventListener("paste", function(e) {
        e.preventDefault();
        var text = e.clipboardData.getData("text/plain");
        document.execCommand("insertHTML", false, text);
    });
});

// change size of servings input to match size width of text
function resizeServings(){
    try {
        if(servings.parentElement.parentElement.className == "unstuck") {
            servingsHidden.innerHTML = servings.value;
            servings.style.width = servingsHidden.clientWidth + 3 + "px";
        } else{
            servingsHiddenStuck.innerHTML = servings.value;
            servings.style.width = servingsHiddenStuck.clientWidth + 1 + "px";
        }
    } catch (error) {
        console.log(error);
    }
}

// detect when user is editting ingredients or instructions and make um more better
try {
    const ingredients = document.getElementsByName("ingredients")[0];
    const originalIngredients = document.getElementById("original-ingredients").querySelector("div");
    // make original ingredients and new ingredients scroll at the same rate
    ingredients.addEventListener("scroll", function(event) {
        scrollUm(false);
    });
    originalIngredients.addEventListener("scroll", function(event) {
        scrollUm(true);
    });
    function scrollUm(original) {
        if(original) {
            ingredients.scrollTop = originalIngredients.scrollTop;
        } else {
            originalIngredients.scrollTop = ingredients.scrollTop;
        }
    }
} catch (error) {
    // console.log(error);
}

try {
    const ingredients = document.getElementsByName("ingredients")[0];
    const instructions = document.getElementsByName("instructions")[0];

    // prevent div element from appearing in ingredients input
    // and ul from disappearing
    setTextChangeListener(ingredients, function(event){
        console.log("ediitttting");
        if (ingredients.querySelector("ul").textContent) {
            ingredients.classList.remove("invalid");
            ingredients.parentElement.querySelector(".error-message").style.display = "none";
        }
        if(!ingredients.contains(ingredients.querySelector("ul"))) {
            let ul = document.createElement('ul');
            // ul.appendChild(document.createElement('li'));
            ingredients.appendChild(ul);
        }   
        ingredients.querySelectorAll("div").forEach(
            function(e) {
                e.remove();
                // let li = document.createElement('li');
                // ingredients.querySelector("ul").appendChild(li);
            }
        );  
        if(!ingredients.contains(ingredients.querySelector("li"))) {
            let li = document.createElement('li');
            ingredients.querySelector("ul").appendChild(li);
        }   
        // ingredients.querySelector("ul").style.width = getTrueWidth(originalIngredients.querySelector("ul")) + "px";
    });

    // prevent div element from appearing in ingredients input
    // and ol from disappearing
    setTextChangeListener(instructions, function(event){
        console.log("ediitttting");
        if (instructions.querySelector("ol").textContent) {
            instructions.classList.remove("invalid");
            instructions.parentElement.querySelector(".error-message").style.display = "none";
        }
        if(!instructions.contains(instructions.querySelector("ol"))) {
            let ol = document.createElement('ol');
            // ol.appendChild(document.createElement('li'));
            instructions.appendChild(ol);
        }   
        instructions.querySelectorAll("div").forEach(
            function(e) {
                e.remove();
                // let li = document.createElement('li');
                // instructions.querySelector("ol").appendChild(li);
            }
        );    
        if(!instructions.contains(instructions.querySelector("li"))) {
            let li = document.createElement('li');
            instructions.querySelector("ol").appendChild(li);
        }   
    });
} catch (error) {
    // console.log(error);
}

// listener for when window is resized
addEventListener("resize", function(e) {
    try {
        ingredients.querySelector("ul").style.width = getTrueWidth(originalIngredients.querySelector("ul")) + "px";
    } catch (error) {
        // console.log(error); 
    }
});


function checkValue(str) {
    var num = parseInt(str);
    if (isNaN(num)) num = 0;
    str = num;
    return str;
}

// event fired when form is sent when a required field is unfilled
document.addEventListener('invalid', (function () {
    return function (e) {
        e.preventDefault();
    };
})(), true);
