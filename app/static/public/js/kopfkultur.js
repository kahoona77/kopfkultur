angular.module('kka.services', []);

var kkModule = angular.module('kopfkultur', ['ngRoute', 'kka.services'])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.
      when('/home', {templateUrl: 'static/public/partials/home.html'}).
      when('/about', {templateUrl: 'static/public/partials/about.html'}).
      when('/contact', {templateUrl: 'static/public/partials/contact.html'}).
      when('/shop', {templateUrl: 'static/public/partials/shop.html'}).
      when('/galerie/:galerieId?', {templateUrl: 'static/public/partials/galerie.html'}).
      when('/galeries/hats', {templateUrl: 'static/public/partials/galeries/hats.html'}).
      when('/galeries/headpieces', {templateUrl: 'static/public/partials/galeries/headpieces.html'}).
      when('/galeries/bridal', {templateUrl: 'static/public/partials/galeries/bridal.html'}).
      when('/galeries/kids', {templateUrl: 'static/public/partials/galeries/kids.html'}).
      otherwise({redirectTo: '/home'});
  }]);

kkModule.controller('KopfKulturController',
  function ($scope, $anchorScroll, $location, galerieService) {

    $('.kk-icon-link').tooltip({
      placement: 'bottom'
    });

    $scope.loadGaleries = function () {
      galerieService.loadGaleries().then(function(response){
        if (response.success) {
          $scope.galeries = response.data;
        }
      });
    };
    $scope.loadGaleries();

    $scope.isScreenXS = true;

    $scope.carouselPrev = function () {
      $('.carousel').carousel('prev');
    };

    $scope.carouselNext = function () {
      $('.carousel').carousel('next');
    };

    $scope.borderlesss = true;
    $('#blueimp-gallery').data('useBootstrapModal',  !$scope.borderlesss);
    $('#blueimp-gallery').toggleClass('blueimp-gallery-controls',  $scope.borderlesss);


  }
);

kkModule.directive ('kkGalerySection', function () {
  return {
    templateUrl: 'static/public/partials/kk-galery.html',
    replace: true,
    restrict: 'E',
    transclude: true,
    controller: function ($scope, $element, $attrs) {
     this.getBaseUrl = function () {
       return $attrs.baseurl;
     };
    }
  };
});

kkModule.directive ('kkGaleryImg', function () {
  return {
    templateUrl: 'static/public/partials/kk-galery-img.html',
    replace: true,
    restrict: 'E',
    require: '^kkGalerySection',
    transclude: true,
    scope: {
      name:'@'
    },

    controller: function ($scope, $element, $transclude) {
      $transclude (function (clone) {
        $scope.transcluded_content = clone.text();
      });
    },

    link: function postLink(scope, iElement, iAttrs, controller) {
      scope.baseURL = controller.getBaseUrl ();
    }
  };
});

kkModule.directive("kkScrollTo", function () {
  return {
    restrict: "AC",
    link: function (scope, iElement, iAttrs) {
      var scrollFn = function() {
        var top = document.getElementById(iAttrs.kkScrollTo).offsetTop
        window.scrollTo( 0, (top - 60) );
      };
      iElement.addClass ('kk-anchor')
      iElement.bind('click', scrollFn);
    }
  };
});
