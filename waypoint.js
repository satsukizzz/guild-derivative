const http = require("http");

module.exports = () => {
  http.createServer((request, response) => {
    if (request.url == '/waypoint') {
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.write("Hey, welcome to the waypoint.");
      response.end();
    } else {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end();
    }
  })
    .listen(process.env.PORT || 8000);
}