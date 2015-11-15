import EventEmitter from 'events';

export class MonitoringService extends EventEmitter {
  constructor ($log, $q, jsCluster) {
    'ngInject';
    super();
    this.$log = $log;
    this.$q = $q;
    this.monitor = jsCluster.monitor(':3210/monitoring', {}, (type, message, data) => {
      this.emit('log', type, message, data);
    });
    this.monitor.ready.then(() => {$log.debug('Monitor connected');});
  }
}
