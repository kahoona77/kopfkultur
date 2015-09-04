'use strict';

/* Controllers */

angular.module('kka.controllers').
controller('ItemsCtrl', ['$scope', '$location', 'itemService', 'msg', '$mdDialog', '$mdBottomSheet', function($scope, $location, itemService, msg, $mdDialog, $mdBottomSheet) {

  $scope.loadItems = function () {
    itemService.loadItems().then(function(response){
      if (response.status == 'ok') {
        $scope.items = response.data;
      } else {
        msg.error (response.status);
      }
    });
  };
  $scope.loadItems();

  $scope.addItem = function () {
    $location.path('/item');
  };

  $scope.editItem = function (item) {
    $location.path('/item/' + item.$id);
  };


  $scope.showBottomSheet = function(item, $event) {
    $mdBottomSheet.show({
      templateUrl: '/static/admin/partials/itemsBottomSheet.html',
      controller: 'BottomSheetCtrl',
      targetEvent: $event
    }).then(function(clickedItem) {
      if (clickedItem == 'edit') {
        $scope.editItem (item);
      }
      if (clickedItem == 'delete') {
        $scope.showItemDeleteConfirm (item);
      }
    });
  };

  $scope.deleteItem = function (item) {
    itemService.removeItem(item).then(function(response){
      if (response.status == 'ok') {
        $scope.loadItems();
      } else {
        msg.error (response.status);
      }
    });
  };

  $scope.showItemDeleteConfirm = function (item) {
    var confirm = $mdDialog.confirm()
      .title('Soll der Artikel "' + item.name + '" wirklich gelöscht werden?')
      .ok('Ok')
      .cancel('Abbrechen');
    $mdDialog.show(confirm).then(function() {
      $scope.deleteItem (item);
    });
  };
}])
.controller('BottomSheetCtrl', function($scope, $mdBottomSheet) {
  $scope.itemClick = function(clickedItem) {
    $mdBottomSheet.hide(clickedItem);
  };
});
