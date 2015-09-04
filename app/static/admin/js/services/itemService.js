var app = angular.module("kka.services");

app.factory('itemService', [ '$q', '$firebaseArray',  function($q, $firebaseArray) {

  var ref = new Firebase("https://kopfkultur.firebaseio.com/items");
  var items = $firebaseArray(ref);

  var l = $q.defer();
  var r = l.promise;

  items.$loaded(function() {
    l.resolve();
  });

  return {
      loadItems: function () {
        var p = $q.defer();
        r.then(function(){
          p.resolve({status: 'ok', data: items});
        });
        return p.promise;
      },

      loadItem: function (id) {
        var p = $q.defer();
        r.then(function(){
          p.resolve({status: 'ok', data: items.$getRecord(id)});
        });
        return p.promise;
      },

      saveItem: function (item) {
        var p = $q.defer();
        if (item.$id) {
          // save existing
          items.$save (item).then(function(ref) {
            p.resolve({status: 'ok', data: ref});
          });
        } else {
          // add new existing
          items.$add (item).then(function(ref) {
            p.resolve({status: 'ok', data: ref});
          });
        }
        return p.promise;
      },

      removeItem: function (item) {
        var p = $q.defer();
        items.$remove (item).then(function(ref) {
          p.resolve({status: 'ok', data: ref});
        });
        return p.promise;
      }
  }
}]);
