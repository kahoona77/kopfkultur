'use strict';

/* Controllers */

angular.module('kka.controllers').
controller('GalleryItemsCtrl', ['$scope', '$location', 'galerieService', 'itemService', '$routeParams', 'msg', '$mdDialog',
function($scope, $location, galerieService, itemService, $routeParams, msg, $mdDialog) {

    $scope.loadGalerie = function (galerieId) {
      galerieService.loadGalerie(galerieId).then(function(response){
        if (response.success) {
          $scope.galerie = response.data;
          angular.forEach($scope.galerie.sections, function(section) {
            var galleryItems = getItemsForSection($scope.galerie.galleryItems, section);
            var items = [];
            angular.forEach(galleryItems, function(galerieItem) {
              var item = {
                position: galerieItem.position,
                item:{}
              };
              items.push(item);
              //load Item
              itemService.loadItem(galerieItem.itemId).then(function(response){
                if (response.success) {
                  item.item = response.data;
                }
              });
            });
            section.items = items;
          });
        } else {
          msg.error (response.status);
        }
      });
    };
    $scope.loadGalerie ($routeParams.galerieId);

    function getItemsForSection (items, section) {
      var result = [];
      if (items) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.sectionName == section.name) {
              result.push(item);
            }
        }
      }
      return result;
    }

    $scope.saveGalleryItems = function (galerie) {
      //set items
      var galleryItems = [];
      angular.forEach(galerie.sections, function(section) {
        angular.forEach(section.items, function(item) {
          var galerieItem = {
            sectionName: section.name,
            position: item.position,
            itemId: item.item.id
          };
          galleryItems.push(galerieItem);
        });
        delete section.items;

      });
      galerie.galleryItems = galleryItems;

      //save the galerie
      galerieService.saveGalerie(galerie).then(function (response) {
        if (response.status = 'ok') {
          $location.path('/galeries');
        } else {
          msg.error(response.status);
        }
      });
    };

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

    $scope.deleteItem = function (section, item) {
      section.items = _.without(section.items, item);
    };

    $scope.showItemDeleteConfirm = function (section, item) {
      var confirm = $mdDialog.confirm()
        .content('Soll der Artikel ' + item.item.name + ' wirklich entfernt werden?')
        .ok('Ok')
        .cancel('Abbrechen');
      $mdDialog.show(confirm).then(function() {
        $scope.deleteItem (section, item);
      });
    };

    $scope.showAddItemDialog = function (section, ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: '/static/admin/partials/addArticleDialog.html',
        targetEvent: ev,
      })
      .then(function(item) {
        $scope.addItem(section, item);
      });
    };

    $scope.addItem = function (section, item) {
      var galerieItem = {};
      galerieItem.position = section.items.length + 1;
      galerieItem.item = item;
      section.items.push (galerieItem);
    };

}]);

function DialogController($scope, $mdDialog, itemService) {
  //mock searchresults
  $scope.allItems = [];
  itemService.loadItems().then(function(response){
    if (response.success) {
      $scope.allItems = response.data;
    } else {
      msg.error (response.status);
    }
  });

  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.addItem = function(item) {
    $mdDialog.hide(item);
  };
}
