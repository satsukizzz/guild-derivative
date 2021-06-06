class ResponseController {
  constructor() {
    this.modules = [];
    this.load();
  }

  load() {
    this.modules.push(require('./waypoint'));
  }
} 

module.exports = ResponseController;
