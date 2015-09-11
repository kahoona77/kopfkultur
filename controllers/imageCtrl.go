package controllers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kahoona77/kopfkultur/models"
	"github.com/kahoona77/kopfkultur/services"
)

// ImageController -
type ImageController struct {
	ImageService *services.ImageService `inject:""`
}

// Save saves an image
func (ic *ImageController) Save(c *gin.Context) {
	var image = new(models.Image)
	c.BindJSON(image)
	err := ic.ImageService.Save(c, image)
	if err != nil {
		renderError(c, err)
		return
	}

	OK(c)
}

// Load loads a single image
func (ic *ImageController) Load(c *gin.Context) {
	var image = new(models.Image)
	image.ID, _ = strconv.ParseInt(c.Query("id"), 0, 64)
	image, err := ic.ImageService.Load(c, image)
	if err != nil {
		renderError(c, err)
		return
	}
	renderOk(c, image)
}

// Delete deletes a single image
func (ic *ImageController) Delete(c *gin.Context) {
	var image = new(models.Image)
	image.ID, _ = strconv.ParseInt(c.Query("id"), 0, 64)
	err := ic.ImageService.Delete(c, image)
	if err != nil {
		renderError(c, err)
		return
	}
	OK(c)
}
