'use strict';

/* Controllers */

angular.module('kka.controllers').
controller('ItemEditCtrl', ['$scope', '$location', 'msg', 'itemService', 'imageService', '$routeParams', '$upload', function($scope, $location, msg, itemService, imageService, $routeParams, $upload) {

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
    thumbCanvas.width=64;
    thumbCanvas.height=64;
    thumbCtx.drawImage(this, 0, 0, thumbCanvas.width, thumbCanvas.height);

    $scope.$apply(function(scope) {
      scope.image = canvas.toDataURL();
      scope.item.thumb = thumbCanvas.toDataURL();
    });

  };

  $scope.loadItem = function (itemId) {
    if (itemId) {
      itemService.loadItem(itemId).then(function(response){
        if (response.success) {
          $scope.item = response.data;

          //load image
          imageService.loadImage($scope.item.id).then (function (response){
            $scope.image = response.data.imageData;
          });

        } else {
          msg.error (response.status);
        }
      });
    }
  };
  $scope.loadItem ($routeParams.itemId);

  $scope.saveItem = function (item) {
    //first save item
    itemService.saveItem(item).then(function (response) {
      if (response.success) {
        item = response.data;
        //then save image
        imageService.saveImage(item.id, $scope.image).then(function(res){
          if (res.success) {
            item.imageId = res.imageId;


            $location.path('/items');
          } else {
            msg.error(res.status);
          }
        });
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
