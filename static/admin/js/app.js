'use strict';

angular.module('kka.controllers', []);
angular.module('kka.services', []);

// Declare app level module which depends on filters, and services
angular.module('kka', [
  'ngRoute',
  'ngAnimate',
  'ngMaterial',
  'firebase',
  'angularFileUpload',
  'kka.services',
  'kka.directives',
  'kka.controllers'
]).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider.when('/home', {templateUrl: '/static/admin/partials/home.html'});
  $routeProvider.when('/items', {templateUrl: '/static/admin/partials/items.html', controller: 'ItemsCtrl'});
  $routeProvider.when('/item/:itemId?', {templateUrl: '/static/admin/partials/itemEdit.html', controller: 'ItemEditCtrl'});
  $routeProvider.when('/galeries', {templateUrl: '/static/admin/partials/galeries.html', controller: 'GaleriesCtrl'});
  $routeProvider.when('/galerie/:galerieId?', {templateUrl: '/static/admin/partials/galerieEdit.html', controller: 'GalerieEditCtrl'});
  $routeProvider.when('/galerieItems/:galerieId?', {templateUrl: '/static/admin/partials/galerieItems.html', controller: 'GalerieItemsCtrl'});

  $routeProvider.otherwise({redirectTo: '/home'});
}]).run(['$rootScope', '$window', function ($rootScope, $window) {
  $rootScope.back = function () {
    $window.history.back();
  };
    }]);
