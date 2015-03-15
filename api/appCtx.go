package api

import (
	"log"
	"net/http"

	"github.com/pelletier/go-toml"
	"github.com/zenazn/goji/web"

	"github.com/kahoona77/kopfkultur/api/model"
)

//Context - the application context
type Context struct {
	Config *toml.TomlTree
	//DB
	mongoDB *model.MongoDB

	//Repositores
	GaleriesRepo *model.Repository
}

func (ctx *Context) Close() {
	ctx.mongoDB.Close()
}

func (ctx *Context) HandleError(err error) {
	if err != nil {
		log.Printf("ERROR: %v", err)
	}
}

//CreateContext - create a new ApplicationContext
func CreateContext(filename string) *Context {
	c := new(Context)

	config, err := toml.LoadFile(filename)
	if err != nil {
		log.Printf("ERROR: TOML load failed: %s\n", err)
	}
	c.Config = config

	c.mongoDB = model.CreateMongoDB(config)

	//Repositories
	c.GaleriesRepo = c.mongoDB.GetRepo("galeries")

	return c
}

func (ctx *Context) ApplyContext(c *web.C, h http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		c.Env["ctx"] = ctx
		h.ServeHTTP(w, r)
	}
	return http.HandlerFunc(fn)
}
