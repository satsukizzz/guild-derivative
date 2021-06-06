const ResponseController = require('./responseController');
const responseController = new ResponseController();

const http = require('http');

let responseFlag = false;
let args = null;

http.createServer((request, response) => {
  for(let responseModule of responseController.modules) {
    if(responseFlag === true) break;
    responseModule(request, response, args);
  };
  if(!responseFlag) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end();
  }
})
.listen(process.env.PORT || 8000);
