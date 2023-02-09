// console.log(recipe);
function reqListener (data) {
    document.body.innerHTML += this.responseText + '&lt;br&gt;';
    }
    setInterval(function () {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "/api");
    oReq.send();
    }, 3456);
    