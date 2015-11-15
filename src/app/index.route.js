export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    })
    .state('monitoring', {
      url: '/monitoring',
      templateUrl: 'app/pages/monitoring/monitoring.html',
      controller: 'MonitoringController',
      controllerAs: 'vm'
    });

  $urlRouterProvider.otherwise('/');
}
