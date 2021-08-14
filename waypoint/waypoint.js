const waypoint = (request, response, args) => {
    if (request.url == '/waypoint') {
        response.writeHead(200, { "Content-Type": "text/plain" });
        response.write("Hey, welcome to the waypoint typescript version.");
        response.end();
        return true;
    }
    return false;
};
module.exports = waypoint;
//# sourceMappingURL=waypoint.js.map