const collapseMenuButton = document.getElementById("collapse-menu-button");
const uncollapseMenuButton = document.getElementById("uncollapse-menu-button");

uncollapseMenuButton.style.paddingTop = collapseMenuButton.getBoundingClientRect().top + "px";

const collapsedMenu = document.getElementById("collapsed-menu");
const menu = document.getElementById("menu");

collapseMenuButton.addEventListener("click", function(event){
	menu.style.display = "none"; 
    collapsedMenu.style.display = "block"; 
}, false);

uncollapseMenuButton.addEventListener("click", function(event){
	menu.style.display = "block"; 
    collapsedMenu.style.display = "none"; 
}, false);