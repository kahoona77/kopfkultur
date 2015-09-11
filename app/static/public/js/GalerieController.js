angular.module('kopfkultur').controller('GalerieController', ['$routeParams', '$filter', '$q', 'galerieService', 'itemService', 'imageService', GalerieController]);

function GalerieController($routeParams, $filter, $q, galerieService, itemService, imageService) {
  this.galerie = {};
  this.images  = {};
  this.galerieService = galerieService;
  this.itemService = itemService;
  this.imageService = imageService;
  this.$filter = $filter;
  this.$q = $q;

  var ctrl = this;
  ctrl.loadGalerie($routeParams.galerieId);

  $('#blueimp-gallery').on('slide', function (event, index, slide) {
    var img = $(slide.getElementsByTagName('img')[0]);
    var itemId = img.attr('title');
    var item = ctrl.items[itemId];

    if (item) {
      //set Title
      $(this).find('.title').html(item.name);

      //load image
      ctrl.getImage(item.imageId).then (function (image){
        img.attr('src', image);
      });
    }

  });

  $('#blueimp-gallery').on('open', function (event, index, slide) {
    var gallery = $('#blueimp-gallery').data('gallery');
    gallery.initStartIndex = function () {
      var index = this.options.index,
          titleProperty = this.options.titleProperty,
          i;
      // Check if the index is given as a list object:
      if (index && typeof index !== 'number') {
          for (i = 0; i < this.num; i += 1) {
              if (this.list[i] === index ||
                      this.getItemProperty(this.list[i], titleProperty) ===
                          this.getItemProperty(index, titleProperty)) {
                  index  = i;
                  break;
              }
          }
      }
      // Make sure the index is in the list range:
      this.index = this.circle(parseInt(index, 10) || 0);
    };
    gallery.initStartIndex();
  });
}

GalerieController.prototype.getImage = function(imageId) {
  var ctrl = this;
  var deferred = ctrl.$q.defer();
  var image = ctrl.images[imageId];
  if (!image) {
    //load image
    ctrl.imageService.loadImage(imageId).then (function (response){
      image = response.data.imageData;
      ctrl.images[imageId] = image;
      deferred.resolve(image);
    });
  } else {
    deferred.resolve(image);
  }
  return deferred.promise;
};

GalerieController.prototype.loadGalerie = function(galerieId) {
  var ctrl = this;
  this.galerieService.loadGalerie(galerieId).then(function(response){
    if (response.success) {
      ctrl.galerie = response.data;
      ctrl.createSections(ctrl.galerie);
    }
  });
};

GalerieController.prototype.createSections = function(galerie) {
  var ctrl = this;
  ctrl.sections = [];
  angular.forEach(galerie.sections, function(sec){
    var section = {
      name        : sec.name,
      description : sec.description,
      position    : sec.position
    }
    section.rows = ctrl.createItemRows(galerie.galleryItems, sec);

    ctrl.sections.push(section);
  });
};

function getItemsForSection (items, section) {
  var result = [];
  if (items) {
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item.sectionName == section.name) {
          result.push(item);
        }
    }
  }
  return result;
}

GalerieController.prototype.createItemRows = function(galleryItems, sec) {
  var ctrl  = this;
  var items = [];
  ctrl.items = {};
  var galleryItems = getItemsForSection(galleryItems, sec);
  angular.forEach(galleryItems, function(gi){
    var item = {
      position    : gi.position
    }

    //load Item
    ctrl.itemService.loadItem(gi.itemId).then(function(response){
      if (response.success) {
        var it = response.data;
        item.id = it.id;
        item.name = it.name;
        item.description = it.description;
        item.thumb = it.thumb;
        item.imageId = it.id;

        ctrl.items[item.id] = item;
      }
    });

    items.push(item);
  });

  items = ctrl.$filter('orderBy')(items, 'position');
  var rows = [];

  var row = []
  for (i = 0; i < items.length; i++) {
      if (i > 0 && i % 4 == 0) {
        rows.push (row);
        row = [];
      }
      row.push(items[i]);
  }
  rows.push (row);

  return rows;
};

GalerieController.prototype.click = function(galerieId) {
  this.galerie;
};
