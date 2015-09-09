package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/kahoona77/kopfkultur/models"
	"github.com/kahoona77/kopfkultur/services"
)

// ItemController creates all routes for the DataController
type ItemController struct {
	ItemService *services.ItemService `inject:""`
}

// List loads all items
func (gc *ItemController) List(c *gin.Context) {
	items, err := gc.ItemService.List(c)
	if err != nil {
		renderError(c, err)
		return
	}

	renderOk(c, items)
}

// Load load a singe item
func (gc *ItemController) Load(c *gin.Context) {
	item, err := gc.ItemService.Load(c, c.Query("id"))
	if err != nil {
		renderError(c, err)
		return
	}

	renderOk(c, item)
}

// Save saves a item
func (gc *ItemController) Save(c *gin.Context) {
	var item = new(models.Item)
	c.BindJSON(item)

	item, err := gc.ItemService.Save(c, item)
	if err != nil {
		renderError(c, err)
		return
	}

	renderOk(c, item)
}

// Delete deletes a item
func (gc *ItemController) Delete(c *gin.Context) {
	err := gc.ItemService.Delete(c, c.Query("id"))

	if err != nil {
		renderError(c, err)
		return
	}

	OK(c)
}
