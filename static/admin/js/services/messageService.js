angular.module ('kka.services').factory('msg', [ '$mdToast', function($mdToast) {
    return {
        show: function (message, type, timeout) {
          $mdToast.show(
            $mdToast.simple()
              .content(message)
              .position( 'top left right')
              .hideDelay(3000)
          );
        },

        error: function (message) {
          $mdToast.show(
            $mdToast.simple()
              .content(message)
              .position( 'top left right')
              .hideDelay(3000)
          );
        }
    }
}]);
