const unstuck = document.getElementsByClassName("unstuck");
const servings = document.getElementById("servings");
const servingsHidden = document.getElementById("servings-hidden");
const servingsHiddenStuck = document.getElementById("servings-hidden-stuck");

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

    // resize ingredients to be the same width as original when editting
    setTextChangeListener(ingredients, function(event){
        console.log(event);
        console.log('Hey, somebody changed something in my text!');
        ingredients.querySelector("ul").style.width = getTrueWidth(originalIngredients.querySelector("ul")) + "px";
    });
    
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
    setTextChangeListener(ingredients, function(event){
        ingredients.querySelectorAll("div").forEach(
            function(e) {
                e.remove();
                let li = document.createElement('li');
                ingredients.querySelector("ul").appendChild(li);
            }
        );        
    });

    setTextChangeListener(instructions, function(event){
        instructions.querySelectorAll("div").forEach(
            function(e) {
                e.remove();
                let li = document.createElement('li');
                instructions.querySelector("ol").appendChild(li);
            }
        );        
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