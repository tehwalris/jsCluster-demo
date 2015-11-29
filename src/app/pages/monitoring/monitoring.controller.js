export class MonitoringController {
  constructor ($log, $scope, _, monitoring, FileSaver) {
    'ngInject';
    this.$log = $log;
    this.$scope = $scope;
    this._ = _;
    this.monitoring = monitoring;
    this.FileSaver = FileSaver;

    this.logs = [];
    this.clients = {};
    this.monitoring.on('log', (type, message, data) => {
      this.$scope.$apply(() => this._log(type, message, data));
    });
    this.startupTime = Date.now();
  }

  saveLogLocally () {
    this.startupTime = Date.now();
    var testTag = prompt("Enter a test tag");
    this.FileSaver.saveAs(
      new Blob([angular.toJson({
        metadata: {
          source: 'monitor',
          startupTime: this.startupTime,
          writeTime: Date.now(),
          testTag: testTag
        },
        data: {
          logs: this.logs,
          clients: this.clients
        }
      }, 2)]),
      'jsCluster-monitor-log[tag_' + testTag + '][started_' + this.startupTime + '].jclog'
    );
  }

  _log (type, message, data) {
    this.logs.push({
      type: type,
      message: message,
      data: data
    });
    var first = true;
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
        this._.forEach(data.distribution, (count, clientUUID) => {
          this.$scope.$broadcast('clusterMap:showPacket', {direction: 'outgoing', clientUUID: clientUUID, count: count, group: data.uuid, stage: 1, advanceStage: first});
          first = false;
        });
        break;
      case 'taskJoin':
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
