export class PrimeFinderService {
  constructor ($log, $q, Multithread, jsCluster) {
    'ngInject';
    this.$log = $log;
    this.$q = $q;
    this.multithread = new Multithread(4); //TODO thread count detection
    this.cluster = jsCluster.connect(':3210', {reconnection: false, transports: ['websocket']});

    this.isPrime = function (n) {
      if(n < 3)
        return false;
      for(var i = 3; i < n; i++) {
        if(n % i == 0)
          return false;
      }
      return n;
    };
  }

  run (settings) {
    return {
      single: this._runSingle,
      multi: this._runMulti,
      cluster: this._runCluster
    }[settings.executionMode].bind(this)(settings);
  }

  _runSingle (settings) {
    var deferred = this.$q.defer();
    var low = settings.center - Math.floor(settings.range / 2);
    var high = settings.center + Math.ceil(settings.range / 2);
    var primes = [];
    for(var i = low; i <= high; i++) {
      if(this.isPrime(i))
        primes.push(i);
    }
    deferred.resolve(primes);
    return deferred.promise;
  }

  _runMulti (settings) {
    var deferred = this.$q.defer();
    var low = settings.center - Math.floor(settings.range / 2);
    var high = settings.center + Math.ceil(settings.range / 2);
    var primes = [];
    var completedCount = 0;
    var isPrimeMultithreaded = this.multithread.process(this.isPrime, function (result) {
      if(result)
        primes.push(result);
      completedCount++;
      if(completedCount == settings.range)
        deferred.resolve(primes);
    });
    for(var i = low; i <= high; i++) {
      isPrimeMultithreaded(i);
    }
    return deferred.promise;
  }

  _runCluster (settings) {
    return this.$q.when(this.cluster.ready.then(() => this.cluster.run('primeDemo', settings)));
  }
}
