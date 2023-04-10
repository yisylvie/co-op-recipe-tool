// // prevent user from opening multiple tabs
// const channel = new BroadcastChannel('tab');

// channel.postMessage('another-tab');
// // note that listener is added after posting the message

// channel.addEventListener('message', (msg) => {
//   if (msg.data === 'another-tab') {
//     // message received from 2nd tab
//     alert('Cannot open multiple instances');
//     window.location.href = '404.html';
//   }
// });

// get the cookie value from the key cname
// from https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
    let  name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue) {
  document.cookie = cname + "=" + cvalue;
}
console.log(sessionStorage);
let cookie = sessionStorage.id;

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}