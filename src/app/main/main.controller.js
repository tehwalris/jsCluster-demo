export class MainController {
  constructor ($log, _, primeFinder) {
    'ngInject';
    this.$log = $log;
    this._ = _;
    this.primeFinder = primeFinder;

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
  }

  run () {
    this.currentJob.running = true;
    var settings = this._.cloneDeep(this.jobSettings);
    var start = (new Date()).getTime();
    this.primeFinder.run(settings)
    .then((result) => {
      this.jobHistory.splice(0, 0, {
        result: result,
        settings: settings,
        runtime: (new Date()).getTime() - start
      });
    })
    .catch((e) => {this.$log.error(e);})
    .finally(() => {this.currentJob.running = false;});
  }
}
