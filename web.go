package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/zenazn/goji"
	"github.com/zenazn/goji/web"
)

func main() {

	// Setup static files
	static := web.New()
	staticDir := "static"
	static.Get("/static/*", http.StripPrefix("/static/", http.FileServer(http.Dir(staticDir))))
	http.Handle("/static/", static)
	goji.NotFound(notFound)

	// bind := fmt.Sprintf("%s:%s", os.Getenv("HOST"), os.Getenv("PORT"))
	bind := ":8080"
	flag.Set("bind", bind)
	goji.Serve()
}

func notFound(w http.ResponseWriter, r *http.Request) {
	p := r.URL.Path
	fmt.Printf("url: %v", p)
	if p == "/" || strings.HasPrefix(p, "/home") {
		body, _ := ioutil.ReadFile("./static/public/index.html")
		fmt.Fprintf(w, string(body))
		return
	}
	if strings.HasPrefix(p, "/static/admin") {
		body, _ := ioutil.ReadFile("./static/admin/index.html")
		fmt.Fprintf(w, string(body))
		return
	}
	w.WriteHeader(http.StatusNotFound)
	fmt.Fprintf(w, "404 Not found.")
}
