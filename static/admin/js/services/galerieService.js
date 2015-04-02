var app = angular.module("kka.services");

app.factory('galerieService', [ '$q', '$firebaseArray',  function($q, $firebaseArray) {

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
        r.then(function(){
          p.resolve({status: 'ok', data: galeries});
        })
        return p.promise;
      },

      loadGalerie: function (id) {
        var p = $q.defer();
        r.then(function(){
          p.resolve({status: 'ok', data: galeries.$getRecord(id)});
        })

        return p.promise;
      },

      saveGalerie: function (galerie) {
        var p = $q.defer();
        if (galerie.$id) {
          // save existing
          galeries.$save (galerie).then(function(ref) {
            p.resolve({status: 'ok', data: ref});
          });
        } else {
          // add new existing
          galeries.$add (galerie).then(function(ref) {
            p.resolve({status: 'ok', data: ref});
          });
        }
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
