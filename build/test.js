const http = require('http'),
    server = http.createServer();

server.on('request',(req,resp)=>{
    if (req.method == 'POST') {
        var body = '';
    }

    req.on('data', function (data) {
        body += data;
    });

    req.on('end', function () {
		if(body) {
			console.log("62" + body);
			resp.writeHead(200,{'Content-Type':'application/json'});
			resp.write(JSON.stringify(body));
			resp.end();
			// let jsonData = JSON.parse(body);
			// if("fetchRecipeFromUrl" in jsonData) {
			// 	fetchRecipeFromUrl(jsonData);
			// } else if("writeModifiedRecipe" in jsonData) {
			// 	writeModifiedRecipe(jsonData);
			// } else if("writeScaledRecipe" in jsonData) {
			// 	writeScaledRecipe(jsonData);
			// }
		}
    });
    // console.log(request);
    resp.writeHead(200,{'Content-Type':'application/json'});
    resp.write('{"Hello world" : asdf}');
    resp.end();
});

server.listen(3456,()=>{
  console.log('Node server created at port 3456');
});