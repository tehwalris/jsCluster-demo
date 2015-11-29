export class MonitoringController {
  constructor ($log, $scope, _, monitoring) {
    'ngInject';
    this.$log = $log;
    this.$scope = $scope;
    this._ = _;
    this.monitoring = monitoring;

    this.logs = [];
    this.clients = {};
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
    switch (this._.get(data, 'type')) {
      case 'clientRegister':
        this.clients[data.uuid] = {};
        break;
      case 'clientDeregister':
        delete this.clients[data.uuid];
        break;
      case 'taskStart':
        this.$scope.$broadcast('clusterMap:showPacket', {direction: 'incoming', clientUUID: data.clientUUID, group: data.uuid, stage: 0, advanceStage: true});
        break;
      case 'taskDistribute':
        var first = true;
        this._.forEach(data.distribution, (count, clientUUID) => {
          this.$scope.$broadcast('clusterMap:showPacket', {direction: 'outgoing', clientUUID: clientUUID, count: count, group: data.uuid, stage: 1, advanceStage: first});
          first = false;
        });
        break;
      case 'taskJoin':
        var first = true;
        this._.forEach(data.distribution, (count, clientUUID) => {
          this.$scope.$broadcast('clusterMap:showPacket', {direction: 'incoming', clientUUID: clientUUID, count: count, group: data.uuid, stage: 2, advanceStage: first});
          first = false;
        });
        break;
      case 'taskComplete':
        this.$scope.$broadcast('clusterMap:showPacket', {direction: 'outgoing', clientUUID: data.clientUUID, group: data.uuid, stage: 3, finalStage: true});
        break;
    }
  }
}
