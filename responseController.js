const fs = require('fs');
const waypointFiles = fs.readdirSync('./waypoint').filter(file => file.endsWith('.js'));

class ResponseController {
  constructor() {
    this.modules = [];
    this.load();
  }

  load() {
    for (const waypoint of waypointFiles) {
      // set a new item in the Collection
      // modules must be a function with (request, response, args) arguments, which request and response are http module parameters
      this.modules.push(require(`./waypoint/${waypoint}`));
  }
} 

module.exports = ResponseController;
