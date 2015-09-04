'use strict';

/* Controllers */

angular.module('kka.controllers').
controller('ItemEditCtrl', ['$scope', '$location', 'itemService', 'imageService', '$routeParams', '$upload', function($scope, $location, itemService, imageService, $routeParams, $upload) {

  $scope.item  = {};
  $scope.image = {};

  var loadImage = function() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    var thumbCanvas = document.getElementById('thumbCanvas');
    var thumbCtx = thumbCanvas.getContext('2d');

    /// set size proportional to image
    canvas.height = canvas.width * (this.height / this.width);
    context.drawImage(this, 0, 0, canvas.width, canvas.height);

    //create thump
    thumbCanvas.width=140;
    thumbCanvas.height=140;
    thumbCtx.drawImage(this, 0, 0, thumbCanvas.width, thumbCanvas.height);

    $scope.$apply(function(scope) {
      scope.image = canvas.toDataURL();
      scope.item.thumb = thumbCanvas.toDataURL();
    });

  };

  $scope.loadItem = function (itemId) {
    if (itemId) {
      itemService.loadItem(itemId).then(function(response){
        if (response.status == 'ok') {
          $scope.item = response.data;

          //load image
          imageService.loadImage($scope.item.imageId).then (function (response){
            $scope.image = response.data;
          });

        } else {
          msg.error (response.status);
        }
      });
    }
  };
  $scope.loadItem ($routeParams.itemId);

  $scope.saveItem = function (item) {
    //first save image
    imageService.saveImage(item.imageId, $scope.image).then(function(res){
      if (res.status == 'ok') {
        item.imageId = res.imageId;

        //then save item
        itemService.saveItem(item).then(function (response) {
          if (response.status == 'ok') {
            $location.path('/items');
          } else {
            msg.error(response.status);
          }
        });
      } else {
        msg.error(res.status);
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
