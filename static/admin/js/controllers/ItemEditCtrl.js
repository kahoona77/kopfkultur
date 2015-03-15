'use strict';

/* Controllers */

angular.module('kka.controllers').
controller('ItemEditCtrl', ['$scope', '$location', 'itemService', '$routeParams', '$mdDialog', function($scope, $location, itemService, $routeParams, $mdDialog) {

  $scope.loadItem = function (itemId) {
    itemService.loadItem(itemId).then(function(response){
      if (response.status == 'ok') {
        $scope.item = response.data;
      } else {
        msg.error (response.status);
      }
    });

  };
  $scope.loadItem ($routeParams.itemId);

  $scope.saveItem = function (item) {
    itemService.saveItem(item).then(function (response) {
      if (response.status = 'ok') {
        $location.path('/items');
      } else {
        msg.error(response.status);
      }
    });
  };

}]);
