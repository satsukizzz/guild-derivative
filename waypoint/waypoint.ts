import * as http from "http";

const waypoint = (request :http.IncomingMessage, response :http.ServerResponse, args :any) :boolean => {
  if (request.url == '/waypoint') {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write("Hey, welcome to the waypoint typescript version.");
    response.end();
    return true;
  }
  return false;
}

module.exports = waypoint;