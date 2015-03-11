'use strict';

/* Controllers */

angular.module('kka.controllers').
controller('GalerieItemsCtrl', ['$scope', '$location', '$http', '$routeParams', 'msg', function($scope, $location, $http, $routeParams, msg) {

    $scope.loadGalerie = function (galerieId) {
      $http.get('/api/galeries/get/' + galerieId).success(function(response){
        if (response.status == 'ok') {
          $scope.galerie = response.data;
          angular.forEach($scope.galerie.sections, function(section) {
            section.items = [
            {position: 1, name: "Artikel 1"},
            {position: 2, name: "Artikel 2"},
            {position: 3, name: "Artikel 3"},
            ];
          });
        } else {
          msg.error (response.status);
        }
      });

    };
    $scope.loadGalerie ($routeParams.galerieId);

    $scope.itemUp = function (section, item) {
      var previous = _.find(section.items, function(it){ return it.position == (item.position - 1); });
      if (previous) {
        previous.position++;
        item.position--;
      }
    };

    $scope.itemDown = function (section, item) {
      var next = _.find(section.items, function(it){ return it.position == (item.position + 1); });
      if (next) {
        next.position--;
        item.position++;
      }
    };

    $scope.deleteItem = function (item) {
      //TODO
    };

    $scope.showItemDeleteConfirm = function (item) {
      $scope.item = item;
      $('#deleteItemDialog').modal('show');
    };

    $scope.showAddItemDialog = function (section) {
      $scope.section = section;

      //mock searchresults
      $scope.searchResults = [{name: '#BLUE STAR'}, {name: '#RED STAR'}, {name: '#PURPLE STAR'}, {name: '#PINK STAR'}]


      $('#addItemDialog').modal('show');
    };

    $scope.addItem = function (item) {
      $('#addItemDialog').modal('hide');

      item.position = $scope.section.items.length + 1;
      $scope.section.items.push (item);

      $scope.section = undefined;
    };

}]);
