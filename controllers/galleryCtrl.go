package controllers

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kahoona77/kopfkultur/models"

	"appengine"
	"appengine/datastore"
)

// GalleryController creates all routes for the DataController
type GalleryController struct {
}

// guestbookKey returns the key used for all guestbook entries.
func galleryKey(c appengine.Context) *datastore.Key {
	// The string "default_guestbook" here could be varied to have multiple guestbooks.
	return datastore.NewKey(c, "Gallery", "default_gallerie", 0, nil)
}

// List loads all galleries
func (gc *GalleryController) List(c *gin.Context) {
	gaeC := appengine.NewContext(c.Request)
	q := datastore.NewQuery("Gallery").Ancestor(galleryKey(gaeC)).Limit(10)
	galleries := make([]models.Gallery, 0, 10)

	if _, err := q.GetAll(gaeC, &galleries); err != nil {
		renderError(c, err)
		return
	}

	renderOk(c, galleries)
}

// Load load a singe gallery
func (gc *GalleryController) Load(c *gin.Context) {
	gaeC := appengine.NewContext(c.Request)
	var id, _ = strconv.ParseInt(c.Query("id"), 0, 64)

	key := datastore.NewKey(gaeC, "Gallery", "", id, galleryKey(gaeC))
	gallery := new(models.Gallery)
	if err := datastore.Get(gaeC, key, gallery); err != nil {
		renderError(c, err)
		return
	}

	renderOk(c, gallery)
}

// Save saves a gallery
func (gc *GalleryController) Save(c *gin.Context) {
	gaeC := appengine.NewContext(c.Request)
	var gallery models.Gallery
	c.BindJSON(&gallery)

	// We set the same parent key on every Greeting entity to ensure each Greeting
	// is in the same entity group. Queries across the single entity group
	// will be consistent. However, the write rate to a single entity group
	// should be limited to ~1/second.

	if gallery.ID == 0 {
		low, _, err := datastore.AllocateIDs(gaeC, "Gallery", galleryKey(gaeC), 1)
		if err != nil {
			renderError(c, err)
			return
		}
		gallery.ID = low
	}

	key := datastore.NewKey(gaeC, "Gallery", "", gallery.ID, galleryKey(gaeC))
	key, err := datastore.Put(gaeC, key, &gallery)
	if err != nil {
		renderError(c, err)
		return
	}

	renderOk(c, gallery)
}
