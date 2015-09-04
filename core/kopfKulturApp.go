package core

import (
	"reflect"
	"unicode"
	"unicode/utf8"

	"github.com/gin-gonic/gin"
	"github.com/kahoona77/kopfkultur/controllers"
)

// KopfKulturApp is the bas App of Emerald
type KopfKulturApp struct {
	GalleryController *controllers.GalleryController `inject:""`
}

//AddControllers add all controllers of emerald to gin
func (app *KopfKulturApp) AddControllers(router *gin.Engine) {
	app.addController(router.Group("api/gallery"), app.GalleryController)
}

func (app *KopfKulturApp) addController(route *gin.RouterGroup, controller interface{}) {
	c := reflect.ValueOf(controller)
	typeOfT := c.Type()
	for i := 0; i < c.NumMethod(); i++ {
		actionName := lowerFirst(typeOfT.Method(i).Name)
		actionInterface := c.Method(i).Interface()
		switch actionMethod := actionInterface.(type) {
		case (func(c *gin.Context)):
			route.Any(actionName, actionMethod)
		}
	}
}

func lowerFirst(s string) string {
	if s == "" {
		return ""
	}
	r, n := utf8.DecodeRuneInString(s)
	return string(unicode.ToLower(r)) + s[n:]
}

//StartJobs starts all jobs
func (app *KopfKulturApp) StartJobs() {

}
