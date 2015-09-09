package services

import (
	"github.com/gin-gonic/gin"
	"github.com/kahoona77/kopfkultur/models"
)

const itemKind = "Item"

// ItemService -
type ItemService struct{}

// List loads all items
func (is *ItemService) List(c *gin.Context) ([]models.Item, error) {
	var items []models.Item
	err := list(c, itemKind, &items)
	return items, err
}

//Load loads a single item
func (is *ItemService) Load(c *gin.Context, itemID string) (*models.Item, error) {
	var item models.Item
	err := load(c, itemKind, itemID, &item)
	return &item, err
}

//Save saves a single item
func (is *ItemService) Save(c *gin.Context, item *models.Item) (*models.Item, error) {
	err := save(c, itemKind, item)
	return item, err
}

//Delete deletes a single item
func (is *ItemService) Delete(c *gin.Context, itemID string) error {
	return delete(c, itemKind, itemID)
}
