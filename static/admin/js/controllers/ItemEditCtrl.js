'use strict';

/* Controllers */

angular.module('kka.controllers').
controller('ItemEditCtrl', ['$scope', '$location', 'itemService', '$routeParams', '$upload', function($scope, $location, itemService, $routeParams, $upload) {

  $scope.item = {};

  var loadImage = function() {
    var fileDrop = document.getElementById("fileDrop");
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    /// set size proportional to image
    canvas.height = canvas.width * (this.height / this.width);
    fileDrop.style.height = (canvas.height + 25)+'px';

    context.drawImage(this, 0, 0, canvas.width, canvas.height);

    $scope.item.image = canvas.toDataURL();
  };

  $scope.loadItem = function (itemId) {
    if (itemId) {
      itemService.loadItem(itemId).then(function(response){
        if (response.status == 'ok') {
          $scope.item = response.data;

          //load image
          var image = new Image();
          image.src = $scope.item.image;
          image.onload = loadImage;

        } else {
          msg.error (response.status);
        }
      });
    }
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

  $scope.$watch('files', function(files) {
    if (files && files.length == 1) {
      var image = files[0];
      var reader= new FileReader();
      reader.onload = function(e) {
         var img = new Image();
         img.onload = loadImage;
         img.src = e.target.result;
      };
      reader.readAsDataURL(image);

    }
  });

}]);
