/* global malarkey:false, moment:false, _:false, Multithread:false, jsCluster:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { MonitoringController } from '../app/pages/monitoring/monitoring.controller';
import { PrimeFinderService } from '../app/components/primeFinder/primeFinder.service';
import { MonitoringService } from '../app/components/monitoring/monitoring.service';
import { GithubContributorService } from '../app/components/githubContributor/githubContributor.service';
import { WebDevTecService } from '../app/components/webDevTec/webDevTec.service';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';
import { MalarkeyDirective } from '../app/components/malarkey/malarkey.directive';

angular.module('jsClusterDemo', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'ui.bootstrap', 'toastr'])
  .constant('malarkey', malarkey)
  .constant('moment', moment)
  .constant('_', _)
  .constant('Multithread', Multithread)
  .constant('jsCluster', jsCluster)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('primeFinder', PrimeFinderService)
  .service('monitoring', MonitoringService)
  .service('githubContributor', GithubContributorService)
  .service('webDevTec', WebDevTecService)
  .controller('MainController', MainController)
  .controller('MonitoringController', MonitoringController)
  .directive('acmeNavbar', NavbarDirective)
  .directive('acmeMalarkey', MalarkeyDirective);
