package services

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kahoona77/kopfkultur/models"

	"appengine"
	"appengine/datastore"
)

// GalleryService -
type GalleryService struct {
}

func galleryKey(c appengine.Context) *datastore.Key {
	return datastore.NewKey(c, "Gallery", "default_gallerie", 0, nil)
}

// List loads all galleries
func (gs *GalleryService) List(c *gin.Context) ([]models.Gallery, error) {
	gaeC := appengine.NewContext(c.Request)
	q := datastore.NewQuery("Gallery").Ancestor(galleryKey(gaeC)).Limit(10)
	galleries := make([]models.Gallery, 0, 10)

	if _, err := q.GetAll(gaeC, &galleries); err != nil {
		return nil, err
	}
	return galleries, nil
}

//Load loads a single gallery
func (gs *GalleryService) Load(c *gin.Context, galleryID string) (*models.Gallery, error) {
	gaeC := appengine.NewContext(c.Request)
	var id, _ = strconv.ParseInt(galleryID, 0, 64)

	key := datastore.NewKey(gaeC, "Gallery", "", id, galleryKey(gaeC))
	gallery := new(models.Gallery)
	if err := datastore.Get(gaeC, key, gallery); err != nil {
		return nil, err
	}
	return gallery, nil
}

//Save saves a single gallery
func (gs *GalleryService) Save(c *gin.Context, gallery *models.Gallery) (*models.Gallery, error) {
	gaeC := appengine.NewContext(c.Request)

	if gallery.ID == 0 {
		low, _, err := datastore.AllocateIDs(gaeC, "Gallery", galleryKey(gaeC), 1)
		if err != nil {
			return nil, err
		}
		gallery.ID = low
	}

	key := datastore.NewKey(gaeC, "Gallery", "", gallery.ID, galleryKey(gaeC))
	key, err := datastore.Put(gaeC, key, gallery)
	if err != nil {
		return nil, err
	}
	return gallery, nil
}
