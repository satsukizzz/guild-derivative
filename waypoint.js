const fs = require('fs');
const secret = JSON.parse(fs.readFileSync('secret.json'));

const http = require("http");

http.createServer((request, response) => {
  if(request.path == 'waypoint') {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hey, welcome to the waypoint.");
    response.end();
  } else {
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.end();
  }
})
.listen(process.env.PORT || secret.PORT);
