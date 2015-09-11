package kopfkultur

import (
	"log"
	"net/http"
	"os"
	"reflect"
	"unicode"
	"unicode/utf8"

	"github.com/facebookgo/inject"
	"github.com/gin-gonic/gin"
	"github.com/kahoona77/kopfkultur/controllers"
)

func init() {
	log.Print("Starting kopf-kultur")
	app := createApp()
	router := gin.New()

	//register all controllers
	app.AddControllers(router)

	//Start all jobs
	app.StartJobs()

	http.Handle("/", router)
}

func createApp() KopfKulturApp {
	var app KopfKulturApp

	var g inject.Graph
	err := g.Provide(
		&inject.Object{Value: &app},
	)
	if err != nil {
		log.Fatal(err)
		os.Exit(1)
	}

	if err := g.Populate(); err != nil {
		log.Fatal(err)
		os.Exit(1)
	}
	return app
}

// KopfKulturApp is the bas App of Emerald
type KopfKulturApp struct {
	GalleryController *controllers.GalleryController `inject:""`
	ItemController    *controllers.ItemController    `inject:""`
	ImageController   *controllers.ImageController   `inject:""`
}

//AddControllers add all controllers of emerald to gin
func (app *KopfKulturApp) AddControllers(router *gin.Engine) {
	app.addController(router.Group("api/item"), app.ItemController)
	app.addController(router.Group("api/image"), app.ImageController)
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
