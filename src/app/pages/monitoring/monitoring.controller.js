export class MonitoringController {
  constructor ($log, $scope, _, monitoring) {
    'ngInject';
    this.$log = $log;
    this.$scope = $scope;
    this._ = _;
    this.monitoring = monitoring;

    this.logs = [];
    this.monitoring.on('log', (type, message, data) => {
      this.$scope.$apply(() => this._log(type, message, data));
    });
  }

  _log (type, message, data) {
    this.logs.push({
      type: type,
      message: message,
      data: data
    });
  }
}
