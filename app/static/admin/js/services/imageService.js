var app = angular.module("kka.services");

app.factory('imageService', [ '$http', '$log',  function($http, $log) {

  function returnData(response) {
    return response.data;
  }

  function logException(error) {
   $log.error('XHR Failed for imageService.' + error.data);
  }

  return {

      loadImage: function (imageId) {
        return $http.get('/api/image/load/?id=' + imageId)
                .then(returnData)
                .catch(logException);
      },

      saveImage: function (imageId, image) {
        return $http.post('/api/image/save', {id: imageId, imageData: image})
                .then(returnData)
                .catch(logException);
      },

      removeImage: function (imageId) {
        return $http.delete('/api/image/delete/?id=' + imageId)
                .then(returnData)
                .catch(logException);
      }
  }
}]);
