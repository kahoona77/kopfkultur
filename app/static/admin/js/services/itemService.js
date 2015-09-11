var app = angular.module("kka.services");

app.factory('itemService', [ '$http', '$log',  function($http, $log) {

  function returnData(response) {
    return response.data;
  }

  function logException(error) {
   $log.error('XHR Failed for itemService.' + error.data);
  }

  return {
      loadItems: function () {
        return $http.get('/api/item/list')
                .then(returnData)
                .catch(logException);
      },

      loadItem: function (id) {
        return $http.get('/api/item/load/?id=' + id)
                .then(returnData)
                .catch(logException);
      },

      saveItem: function (item) {
        return $http.post('/api/item/save', item)
                .then(returnData)
                .catch(logException);
      },

      removeItem: function (item) {
        return $http.delete('/api/item/delete/?id=' + item.id)
                .then(returnData)
                .catch(logException);
      }
  }
}]);
