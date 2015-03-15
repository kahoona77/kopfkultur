'use strict';

/* Controllers */

angular.module('kka.controllers').
controller('GalerieEditCtrl', ['$scope', '$location', '$http', '$routeParams', '$mdDialog', function($scope, $location, $http, $routeParams, $mdDialog) {

  $scope.loadGalerie = function (galerieId) {
    $http.get('/api/galeries/get/' + galerieId).success(function(response){
      if (response.status == 'ok') {
        $scope.galerie = response.data;
      } else {
        msg.error (response.status);
      }
    });

  };
  $scope.loadGalerie ($routeParams.galerieId);

  $scope.saveGalerie = function (galerie) {
    $http.post('/api/galeries/save', {galerie: $scope.galerie}).success(function (response) {
      if (response.status = 'ok') {
        $location.path('/galeries');
      } else {
        msg.error(response.status);
      }
    });
  };

  $scope.addSection = function () {
    if (!$scope.galerie.sections) {
      $scope.galerie.sections = [];
    }

    var section = {position: ($scope.galerie.sections.length + 1) };
    $scope.galerie.sections.push (section);
  };

  $scope.deleteSection = function (section) {
    $scope.galerie.sections = _.without($scope.galerie.sections, section);
  };

  $scope.showSectionDeleteConfirm = function (section) {
    var confirm = $mdDialog.confirm()
      .content('Soll der Abschnitt ' + section.name + ' wirklich gelöscht werden?')
      .ok('Ok')
      .cancel('Abbrechen');
    $mdDialog.show(confirm).then(function() {
      $scope.deleteSection (section);
    });
  };

  $scope.sectionUp = function (section) {
    var previous = _.find($scope.galerie.sections, function(sec){ return sec.position == (section.position - 1); });
    if (previous) {
      previous.position++;
      section.position--;
    }
  };

  $scope.sectionDown = function (section) {
    var next = _.find($scope.galerie.sections, function(sec){ return sec.position == (section.position + 1); });
    if (next) {
      next.position--;
      section.position++;
    }
  };

}]);
