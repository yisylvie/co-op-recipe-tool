// console.log(recipe);
function reqListener (data) {
    // &lt;br&gt; = <br>
    document.body.innerHTML += this.responseText + '&lt;br&gt;';
}
setInterval(function () {
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("GET", "../../index.js");
    oReq.send();
    }, 3456);


// var http = require('http');

// var req = http.request(options, function (res) {
// });

// req.write("whore");
// req.end();

// requestHandler("whore");

// const body = document.getElementsByTagName("body");
// body[0].innerHTML = "whore";