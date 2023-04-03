// function sendTest() {
//     let jsonData;
//     const data = { 'url': "https://www.food.com/recipe/moist-chocolate-cupcakes-super-easy-budget-287618?scaleto=20&mode=null&st=true"};
//     fetch('http://localhost:8000/testing.php', {
//         method: "POST",
//         body: JSON.stringify(data),
//         headers: { 'content-type': 'application/json', 
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
//         "Access-Control-Allow-Headers": "*"
//         }
//     })
//     .then(response => response.json())
//     .then(data => {console.log(data); jsonData = data; sent();})
//     .catch(err => console.error(err));
    
//     function sent() {
//         // let success = jsonData.success;
//         // let message = jsonData.message;
//         // // if(success) {
//         // //     console.log()
//         // // } else {
//         // //     console.log(message);
//         // // }
//         console.log(jsonData);
//         recieveTest();
//     }
// }

// sendTest();

function sendUrlTest() {
    let jsonData;
    const data = { 'url': "https://www.food.com/recipe/moist-chocolate-cupcakes-super-easy-budget-287618?scaleto=20&mode=null&st=true"};
    fetch('bro.json', {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json', 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "*"
        }
    })
    .then(response => response.json())
    .then(data => {console.log(data); jsonData = data; sent();})
    .catch(err => console.error(err));
    
    function sent() {
        recieveTest();
        // if(success) {
        //     console.log()
        // } else {
        //     console.log(message);
        // }
        // console.log(jsonData);
    }
}

function recieveTest() {
    let jsonData;
    fetch('bro.json', {
        method: "POST",
        headers: { 'content-type': 'application/json', 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "PUT, GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "*"
        }
    })
    .then(response => response.json())
    .then(data => {console.log(data); jsonData = data; sent();})
    .catch(err => console.error(err));
    
    function sent() {
        
        let success = jsonData.success;
        let message = jsonData.message;
        // if(success) {
        //     console.log()
        // } else {
        //     console.log(message);
        // }
        // console.log(jsonData);
    }
}

sendUrlTest();
