'use strict';

/* Directives */


angular.module('kka.directives', []).
  directive('confirmDialog', [function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: '<div class="modal fade xtv-confirm-dialog" tabindex="-1" role="dialog" aria-labelledby="confirmDialogLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"> <div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title" id="confirmDialogLabel">Confirm</h4></div><div class="modal-body" ng-transclude></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-primary" ng-click="confirm()" data-dismiss="modal">Ok</button></div></div></div></div>',
      scope: {
        confirm: '&'
      }
    };
  }]);
