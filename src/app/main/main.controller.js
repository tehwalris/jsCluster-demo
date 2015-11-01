export class MainController {
  constructor () {
    'ngInject';

    this.globalSettings = {
      modes: {
        single: 'Single-threaded (local)',
        multi: 'Multi-threaded (local)',
        cluster: 'Cluster'
      },
      inputs: {
        center: {min: 5000, max: 100000},
        range: {min: 1000, max: 5000}
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
    //run here
    this.jobHistory.splice(0, 0, {
      settings: _.cloneDeep(this.jobSettings),
      runtime: undefined //TODO
    });
  }
}
