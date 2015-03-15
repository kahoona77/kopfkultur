'use strict';

/* Controllers */

angular.module('kka.controllers').
controller('GalerieItemsCtrl', ['$scope', '$location', 'galerieService', '$routeParams', 'msg', '$mdDialog', function($scope, $location, galerieService, $routeParams, msg, $mdDialog) {

    $scope.loadGalerie = function (galerieId) {
      galerieService.loadGalerie(galerieId).then(function(response){
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
      var confirm = $mdDialog.confirm()
        .content('Soll der Artikel ' + item.name + ' wirklich entfernt werden?')
        .ok('Ok')
        .cancel('Abbrechen');
      $mdDialog.show(confirm).then(function() {
        $scope.deleteItem (item);
      });
    };

    $scope.showAddItemDialog = function (section, ev) {
      $mdDialog.show({
        controller: DialogController,
        templateUrl: '/static/admin/partials/addArticleDialog.html',
        targetEvent: ev,
      })
      .then(function(answer) {
        $scope.alert = 'You said the information was "' + answer + '".';
      }, function() {
        $scope.alert = 'You cancelled the dialog.';
      });



      $scope.section = section;




      $('#addItemDialog').modal('show');
    };

    $scope.addItem = function (item) {
      $('#addItemDialog').modal('hide');

      item.position = $scope.section.items.length + 1;
      $scope.section.items.push (item);

      $scope.section = undefined;
    };

}]);

function DialogController($scope, $mdDialog) {
  //mock searchresults
  $scope.searchResults = [{name: '#BLUE STAR'}, {name: '#RED STAR'}, {name: '#PURPLE STAR'}, {name: '#PINK STAR'}]

  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}
