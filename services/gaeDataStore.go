package services

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/kahoona77/kopfkultur/models"

	"appengine"
	"appengine/datastore"
)

func defaultKey(c appengine.Context, kind string) *datastore.Key {
	return datastore.NewKey(c, kind, "default_"+kind, 0, nil)
}

// List loads all galleries
func list(c *gin.Context, kind string, result interface{}) error {
	gaeC := appengine.NewContext(c.Request)
	q := datastore.NewQuery(itemKind).Ancestor(defaultKey(gaeC, kind)).Limit(10)

	if _, err := q.GetAll(gaeC, result); err != nil {
		return err
	}
	return nil
}

//Load loads a single gallery
func load(c *gin.Context, kind string, gaeID string, result models.GaeModel) error {
	gaeC := appengine.NewContext(c.Request)
	var id, _ = strconv.ParseInt(gaeID, 0, 64)

	key := datastore.NewKey(gaeC, kind, "", id, defaultKey(gaeC, kind))
	if err := datastore.Get(gaeC, key, result); err != nil {
		return err
	}
	return nil
}

//Save saves a single gallery
func save(c *gin.Context, kind string, model models.GaeModel) error {
	gaeC := appengine.NewContext(c.Request)

	if model.GetID() == 0 {
		low, _, err := datastore.AllocateIDs(gaeC, kind, defaultKey(gaeC, kind), 1)
		if err != nil {
			return err
		}
		model.SetID(low)
	}

	key := datastore.NewKey(gaeC, itemKind, "", model.GetID(), defaultKey(gaeC, kind))
	key, err := datastore.Put(gaeC, key, model)
	if err != nil {
		return err
	}
	return nil
}

//Delete deletes a single gallery
func delete(c *gin.Context, kind string, modelID string) error {
	gaeC := appengine.NewContext(c.Request)
	var id, _ = strconv.ParseInt(modelID, 0, 64)

	key := datastore.NewKey(gaeC, kind, "", id, defaultKey(gaeC, kind))
	return datastore.Delete(gaeC, key)
}
