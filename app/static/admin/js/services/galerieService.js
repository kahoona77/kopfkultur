var app = angular.module("kka.services");

app.factory('galerieService', [ '$q', '$firebaseArray', '$http',  function($q, $firebaseArray, $http) {

  var ref = new Firebase("https://kopfkultur.firebaseio.com/galeries");
  var galeries = $firebaseArray(ref);

  var l = $q.defer();
  var r = l.promise;

  galeries.$loaded(function() {
    l.resolve();
  });

  return {


      loadGaleries: function () {
        var p = $q.defer();
        $http.get('/api/gallery/list'). then(function(response) {
          var result = response.data;
          p.resolve({status: 'ok', data: result.data});
        });
        return p.promise;
      },

      loadGalerie: function (id) {
        var p = $q.defer();
        $http.get('/api/gallery/load/?id=' + id). then(function(response) {
          var result = response.data;
          p.resolve({status: 'ok', data: result.data});
        });

        return p.promise;
      },

      saveGalerie: function (galerie) {
        var p = $q.defer();
        // if (galerie.$id) {
        //   // save existing
        //   galeries.$save (galerie).then(function(ref) {
        //     p.resolve({status: 'ok', data: ref});
        //   });
        // } else {
        //   // add new existing
        //   galeries.$add (galerie).then(function(ref) {
        //     p.resolve({status: 'ok', data: ref});
        //   });
        // }

        $http.post('/api/gallery/save', galerie). then(function(response) {
          var result = response.data;
          p.resolve({status: 'ok', data: result.data});
        });

        return p.promise;
      },

      removeGalerie: function (galerie) {
        var p = $q.defer();
        galeries.$remove (galerie).then(function(ref) {
          p.resolve({status: 'ok', data: ref});
        });
        return p.promise;
      }
  }
}]);
