var app = angular.module("kka.services");

app.factory('galerieService', ['$http', '$log', function($http, $log) {

  function returnData(response) {
    return response.data;
  }

  function logException(error) {
   $log.error('XHR Failed for galerieService.' + error.data);
  }

  return {

      loadGaleries: function () {
        return $http.get('/api/gallery/list')
                .then(returnData)
                .catch(logException);
      },

      loadGalerie: function (id) {
        return $http.get('/api/gallery/load/?id=' + id)
                .then(returnData)
                .catch(logException);
      },

      saveGalerie: function (galerie) {
        return $http.post('/api/gallery/save', galerie)
                .then(returnData)
                .catch(logException);
      },

      removeGalerie: function (galerie) {
        return $http.delete('/api/gallery/delete/?id=' + galerie.id)
                .then(returnData)
                .catch(logException);
      }
  }
}]);
