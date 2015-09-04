var app = angular.module("kka.services");

app.factory('imageService', [ '$q',  function($q) {

  var images = new Firebase("https://kopfkultur.firebaseio.com/images");

  return {

      loadImage: function (imageId) {
        var p = $q.defer();
        var ref = images.child(imageId);
        ref.once("value", function(data) {
          p.resolve({status: 'ok', data: data.val()});
        });
        return p.promise;
      },

      saveImage: function (imageId, image) {
        var p = $q.defer();

        if (!imageId) {
          var ref = images.push(image, function (err){
            if (!err) {
              p.resolve({status: 'ok', imageId: ref.key()});
            } else {
              p.resolve({status: 'Error while saving image', error: err});
            }
          });
        } else {
          var ref = images.child (imageId);
          ref.set(image, function (err){
            if (!err) {
              p.resolve({status: 'ok', imageId: ref.key()});
            } else {
              p.resolve({status: 'Error while saving image', error: err});
            }
          });
        }

        return p.promise;
      },

      removeImage: function (imageId) {
        var p = $q.defer();
        var ref = images.child(imageId);
        ref.set(image, function (err){
          if (!err) {
            p.resolve({status: 'ok', imageId: ref.key()});
          } else {
            p.resolve({status: 'Error while removing image', error: err});
          }
        });
        return p.promise;
      }
  }
}]);
