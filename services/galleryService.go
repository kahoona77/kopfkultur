package services

import (
	"github.com/gin-gonic/gin"
	"github.com/kahoona77/kopfkultur/models"
)

const galleryKind = "Gallery"

// GalleryService -
type GalleryService struct{}

// List loads all galleries
func (is *GalleryService) List(c *gin.Context) ([]models.Gallery, error) {
	var galleries []models.Gallery
	err := list(c, galleryKind, &galleries)
	return galleries, err
}

//Load loads a single gallery
func (is *GalleryService) Load(c *gin.Context, galleryID string) (*models.Gallery, error) {
	var gallery models.Gallery
	err := load(c, galleryKind, galleryID, &gallery)
	return &gallery, err
}

//Save saves a single gallery
func (is *GalleryService) Save(c *gin.Context, gallery *models.Gallery) (*models.Gallery, error) {
	err := save(c, galleryKind, gallery)
	return gallery, err
}

//Delete deletes a single gallery
func (is *GalleryService) Delete(c *gin.Context, galleryID string) error {
	return delete(c, galleryKind, galleryID)
}
