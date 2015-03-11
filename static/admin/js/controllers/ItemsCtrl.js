'use strict';

/* Controllers */

angular.module('kka.controllers').
controller('ItemsCtrl', ['$scope', '$location', '$http', 'msg', function($scope, $location, $http, msg) {

  $scope.loadGaleries = function () {
    $http.get('/api/galeries/loadAll').success(function(response){
      if (response.status == 'ok') {
        $scope.galeries = response.galeries;
      } else {
        msg.error (response.status);
      }
    });
  };
  $scope.loadGaleries();

  $scope.addGalerie = function () {
    var galerie = {};
    $scope.galeries.push (galerie);
    $scope.editGalerie (galerie);
  };

  $scope.editGalerie = function (galerie) {
    $scope.galerie = galerie;
    $('#galerieDialog').modal('show');
  };

  $scope.saveGalerie = function (galerie) {
    $http.post('/api/galeries/save', {galerie: $scope.galerie}).success(function (response) {
      if (response.status = 'ok') {
        $scope.loadGaleries();
        $scope.galerie = undefined;
        $('#galerieDialog').modal('hide');
      } else {
        msg.error(response.status);
      }
    });
  };

  $scope.deleteGalerie = function (galerie) {
    $http.post('/api/galeries/delete', {galerie: $scope.galerie}).success(function (response) {
      if (response.status = 'ok') {
        $scope.loadGaleries();
      } else {
        msg.error(response.status);
      }
    });
  };

  $scope.showGalerieDeleteConfirm = function (galerie) {
    $scope.galerie = galerie;
    $('#deleteGalerieDialog').modal('show');
  };

  $scope.addSection = function () {
    if (!$scope.galerie.sections) {
      $scope.galerie.sections = [];
    }

    var section = {position: ($scope.galerie.sections.length + 1) };
    $scope.galerie.sections.push (section);
  };

  $scope.deleteSection = function (section) {
    //TODO
    $scope.section = undefined;
  };

  $scope.showSectionDeleteConfirm = function (section) {
    $scope.section = section;
    $('#deleteSectionDialog').modal('show');
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

  $scope.editItems = function (galerie) {
    $location.path('/galerieItems/' + galerie.id);
  };

}]);
