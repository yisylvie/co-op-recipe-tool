const unstuck = document.getElementsByClassName("unstuck");

var observer = new IntersectionObserver(function(entries) {
	// no intersection with screen
	if(entries[0].intersectionRatio === 0) {
        for (let i = 0; i < unstuck.length; i++) {
            unstuck[i].classList.add("stuck");
            unstuck[i].classList.remove("unstuck");
        }
    }

	// fully intersects with screen
	else if(entries[0].intersectionRatio === 1) {
        const stuck = document.getElementsByClassName("stuck");
    	for (let i = 0; i < stuck.length; i++) {
            stuck[i].classList.add("unstuck");
            stuck[i].classList.remove("stuck");
        }
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