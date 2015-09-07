package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/kahoona77/kopfkultur/models"
	"github.com/kahoona77/kopfkultur/services"
)

// GalleryController creates all routes for the DataController
type GalleryController struct {
	GalleryService *services.GalleryService `inject:""`
}

// List loads all galleries
func (gc *GalleryController) List(c *gin.Context) {
	galleries, err := gc.GalleryService.List(c)
	if err != nil {
		renderError(c, err)
		return
	}

	renderOk(c, galleries)
}

// Load load a singe gallery
func (gc *GalleryController) Load(c *gin.Context) {
	gallery, err := gc.GalleryService.Load(c, c.Query("id"))
	if err != nil {
		renderError(c, err)
		return
	}

	renderOk(c, gallery)
}

// Save saves a gallery
func (gc *GalleryController) Save(c *gin.Context) {
	var gallery = new(models.Gallery)
	c.BindJSON(gallery)

	gallery, err := gc.GalleryService.Save(c, gallery)
	if err != nil {
		renderError(c, err)
		return
	}

	renderOk(c, gallery)
}
