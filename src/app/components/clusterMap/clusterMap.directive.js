export function ClusterMapDirective () {
  'ngInject';

  let directive = {
    restrict: 'E',
    scope: {
      clients: '='
    },
    templateUrl: 'app/components/clusterMap/clusterMap.html',
    link: linkFunc,
    controller: ClusterMapController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;

  function linkFunc(scope, el, attr, vm) {
  }
}

class ClusterMapController {
  constructor ($log, $timeout, $scope, _, $element) {
    'ngInject';

    this.$log = $log;
    this.$timeout = $timeout;
    this._ = _;
    this.$element = $element;

    this.packets = [];
    this.packetGroups = {};

    $scope.$watchCollection('vm.clients', (clients) => {
      this.clientArray = this._.values(clients);
      this.calculateClientPositions();
    });
    $scope.$on('clusterMap:showPacket', (event, settings) => {this.showPacket(settings);});
  }

  showPacket (settings) {
    if(!this._.isUndefined(settings.group)) {
      var group = this.packetGroups[settings.group] = this.packetGroups[settings.group] || {stage: 0, packetsByStage: []};
      group.packetsByStage[settings.stage] = group.packetsByStage[settings.stage] || [];
      if(settings.direction)
        group.packetsByStage[settings.stage].push(settings);
      var shouldDelete = false;
      _.forEach(group.packetsByStage[group.stage], (packet) => {
        packet.position = this.clients[packet.clientUUID].position;
        this.packets.push(packet);
        this.$timeout(() => {this.packets.splice(0, 1);}, 300); //HACK fixed time
        if(packet.advanceStage)
          this.$timeout(() => {group.stage++; this.showPacket({group: settings.group});}, 300); //HACK fixed time
        shouldDelete = packet.finalStage || shouldDelete;
      });
      delete group.packetsByStage[group.stage];
      if(shouldDelete)
        delete this.packetGroups[settings.group];
    } else {
      settings.position = this.clients[settings.clientUUID].position;
      this.packets.push(settings);
      this.$timeout(() => {this.packets.splice(0, 1);}, 300); //HACK fixed time
    }
  }

  calculateClientPositions () {
    var width = this.$element[0].clientWidth, height = this.$element[0].clientHeight;
    this._.forEach(this.clientArray, (client, i) => {
      //HACK hardcoded values
      client.position = {
        x: (height / 2 * 0.7 * Math.sin(2*Math.PI*i/this.clientArray.length)) + 'px',
        y: (width / -2 * 0.7 * Math.cos(2*Math.PI*i/this.clientArray.length)) + 'px'
      };
    });
  }
}
