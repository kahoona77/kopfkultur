package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/pelletier/go-toml"
	"github.com/zenazn/goji"
	"github.com/zenazn/goji/web"

	"rhcloud.com/kahoona77/kopfkultur/api"
	"rhcloud.com/kahoona77/kopfkultur/api/controllers"
)

func main() {

	ctx := api.CreateContext("config.toml")

	goji.Use(ctx.ApplyContext)

	// Setup static files
	static := web.New()
	staticDir := "static"
	static.Get("/static/*", http.StripPrefix("/static/", http.FileServer(http.Dir(staticDir))))
	http.Handle("/static/", static)
	goji.NotFound(notFound)

	controllers.InitRoutes()

	// bind := fmt.Sprintf("%s:%s", os.Getenv("HOST"), os.Getenv("PORT"))
	bind := getBinding(ctx.Config)
	flag.Set("bind", bind)
	goji.Serve()
}

func notFound(w http.ResponseWriter, r *http.Request) {
	p := r.URL.Path
	if p == "/" || strings.HasPrefix(p, "/home") {
		body, _ := ioutil.ReadFile("./static/public/index.html")
		fmt.Fprintf(w, string(body))
		return
	}
	if strings.HasPrefix(p, "/admin") {
		body, _ := ioutil.ReadFile("./static/admin/index.html")
		fmt.Fprintf(w, string(body))
		return
	}
	w.WriteHeader(http.StatusNotFound)
	fmt.Fprintf(w, "404 Not found.")
}

func getBinding(config *toml.TomlTree) string {
	useConfig, _ := strconv.ParseBool(config.Get("general.use_config").(string))

	if useConfig {
		port := config.Get("general.port").(string)
		return fmt.Sprintf("%s:%s", "", port)
	}

	return fmt.Sprintf("%s:%s", os.Getenv("HOST"), os.Getenv("PORT"))
}
