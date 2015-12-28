export class MainController {
  constructor ($log, _, primeFinder, FileSaver) {
    'ngInject';
    this.$log = $log;
    this._ = _;
    this.primeFinder = primeFinder;
    this.FileSaver = FileSaver;

    this.globalSettings = {
      modes: {
        single: 'Single-threaded (local)',
        multi: 'Multi-threaded (local, inefficient)',
        cluster: 'Cluster'
      },
      inputs: {
        center: {min: 10000, max: 10000000},
        range: {min: 1000, max: 10000}
      }
    };
    this.jobSettings = {
      executionMode: 'single',
      center: 10000,
      range: 2000
    };
    this.currentJob = {
      running: false
    };
    this.jobHistory = [];
    this.startupTime = Date.now();
  }

  run (n, sweep, sweepN) {
    this.currentJob.running = true;
    if(sweep) {
      sweepN = sweepN || n;
      var sweepProgress = (sweepN - n)/sweepN;
      var centerRangesLog = this._.mapValues(this.globalSettings.inputs.center, (value) => Math.log10(value));
      this.jobSettings.center = Math.floor(Math.pow(10, ((1 - sweepProgress) * centerRangesLog.min + sweepProgress * centerRangesLog.max)));
    }
    var settings = this._.cloneDeep(this.jobSettings);
    var start = performance.now();
    this.primeFinder.run(settings)
    .then((result) => {
      this.jobHistory.splice(0, 0, {
        result: result,
        settings: settings,
        runtime: performance.now() - start
      });
      if(n > 0) {
        this.run(n-1, sweep, sweepN);
        this.jobSettings.center = this.globalSettings.inputs.center.min;
      }
    })
    .catch((e) => {this.$log.error(e);})
    .finally(() => {if(!n) this.currentJob.running = false;});
  }

  saveLogLocally () {
    var testTag = prompt("Enter a test tag");
    var data = this._.map(this.jobHistory, (job) => this._.omit(job, 'result'));
    this.FileSaver.saveAs(
      new Blob([angular.toJson({
        metadata: {
          source: 'client',
          startupTime: this.startupTime,
          writeTime: Date.now(),
          clientUUID: this.primeFinder.cluster.uuid,
          testTag: testTag
        },
        data: data
      }, 2)]),
      'jsCluster-client-log[tag_' + testTag + '][started_' + this.startupTime + '].jclog'
    );
  }
}
