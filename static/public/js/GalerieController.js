angular.module('kopfkultur').controller('GalerieController', ['$routeParams', 'galerieService', GalerieController]);

function GalerieController($routeParams, galerieService) {
  this.galerie = {};
  this.galerieService = galerieService;

  this.loadGalerie($routeParams.galerieId);
}

GalerieController.prototype.loadGalerie = function(galerieId) {
  var ctrl = this;
  this.galerieService.loadGalerie(galerieId).then(function(response){
    if (response.status == 'ok') {
      ctrl.galerie = response.data;
    }
  });
};

GalerieController.prototype.click = function(galerieId) {
  this.galerie;
};
