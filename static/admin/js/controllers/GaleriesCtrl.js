'use strict';

/* Controllers */

angular.module('kka.controllers').
controller('GaleriesCtrl', ['$scope', '$location', 'galerieService', 'msg', '$mdDialog', '$mdBottomSheet', function($scope, $location, galerieService, msg, $mdDialog, $mdBottomSheet) {

  $scope.loadGaleries = function () {
    galerieService.loadGaleries().then(function(response){
      if (response.status == 'ok') {
        $scope.galeries = response.data;
      } else {
        msg.error (response.status);
      }
    });
  };
  $scope.loadGaleries();

  $scope.addGalerie = function () {
    $location.path('/galerie');
  };

  $scope.editGalerie = function (galerie) {
    $location.path('/galerie/' + galerie.$id);
  };

  $scope.editItems = function (galerie) {
    $location.path('/galerieItems/' + galerie.$id);
  };

  $scope.showBottomSheet = function(galerie, $event) {
    $mdBottomSheet.show({
      templateUrl: '/static/admin/partials/galeriesBottomSheet.html',
      controller: 'BottomSheetCtrl',
      targetEvent: $event
    }).then(function(clickedItem) {
      if (clickedItem == 'edit') {
        $scope.editGalerie (galerie);
      }
      if (clickedItem == 'delete') {
        $scope.showGalerieDeleteConfirm (galerie);
      }
      if (clickedItem == 'editItems') {
        $scope.editItems (galerie);
      }
    });
  };

  $scope.deleteGalerie = function (galerie) {
    galerieService.removeGalerie(galerie).then(function(response){
      if (response.status == 'ok') {
        $scope.loadGaleries();
      } else {
        msg.error (response.status);
      }
    });
  };

  $scope.showGalerieDeleteConfirm = function (galerie) {
    var confirm = $mdDialog.confirm()
      .title('Soll die Galerie ' + galerie.name + ' wirklich gelöscht werden?')
      .ok('Ok')
      .cancel('Abbrechen');
    $mdDialog.show(confirm).then(function() {
      $scope.deleteGalerie (galerie);
    });
  };
}])
.controller('BottomSheetCtrl', function($scope, $mdBottomSheet) {
  $scope.itemClick = function(clickedItem) {
    $mdBottomSheet.hide(clickedItem);
  };
});
