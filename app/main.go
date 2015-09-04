package kopfkultur

import (
	"fmt"
	"html/template"
	"net/http"
	"os"
	"time"

	"github.com/facebookgo/inject"
	"github.com/gin-gonic/gin"
	"github.com/kahoona77/kopfkultur/core"

	"appengine"
	"appengine/datastore"
	"appengine/user"
)

type Greeting struct {
	Author  string
	Content string
	Date    time.Time
}

func init() {
	app := createApp()
	router := gin.New()

	//register all controllers
	app.AddControllers(router)

	//Start all jobs
	app.StartJobs()

	http.Handle("/", router)
}

func createApp() core.KopfKulturApp {
	var app core.KopfKulturApp

	var g inject.Graph
	err := g.Provide(
		&inject.Object{Value: &app},
	)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	if err := g.Populate(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	return app
}

// guestbookKey returns the key used for all guestbook entries.
func guestbookKey(c appengine.Context) *datastore.Key {
	// The string "default_guestbook" here could be varied to have multiple guestbooks.
	return datastore.NewKey(c, "Guestbook", "default_guestbook", 0, nil)
}

func root(gc *gin.Context) {
	c := appengine.NewContext(gc.Request)
	// Ancestor queries, as shown here, are strongly consistent with the High
	// Replication Datastore. Queries that span entity groups are eventually
	// consistent. If we omitted the .Ancestor from this query there would be
	// a slight chance that Greeting that had just been written would not
	// show up in a query.
	q := datastore.NewQuery("Greeting").Ancestor(guestbookKey(c)).Order("-Date").Limit(10)
	greetings := make([]Greeting, 0, 10)
	w := gc.Writer
	if _, err := q.GetAll(c, &greetings); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if err := guestbookTemplate.Execute(w, greetings); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

var guestbookTemplate = template.Must(template.New("book").Parse(`
<html>
  <head>
    <title>Go Guestbook</title>
  </head>
  <body>
    {{range .}}
      {{with .Author}}
        <p><b>{{.}}</b> wrote:</p>
      {{else}}
        <p>An anonymous person wrote:</p>
      {{end}}
      <pre>{{.Content}}</pre>
    {{end}}
    <form action="/sign" method="post">
      <div><textarea name="content" rows="3" cols="60"></textarea></div>
      <div><input type="submit" value="Sign Guestbook"></div>
    </form>
  </body>
</html>
`))

func sign(gc *gin.Context) {
	c := appengine.NewContext(gc.Request)
	w := gc.Writer
	g := Greeting{
		Content: gc.Request.FormValue("content"),
		Date:    time.Now(),
	}
	if u := user.Current(c); u != nil {
		g.Author = u.String()
	}
	// We set the same parent key on every Greeting entity to ensure each Greeting
	// is in the same entity group. Queries across the single entity group
	// will be consistent. However, the write rate to a single entity group
	// should be limited to ~1/second.
	key := datastore.NewIncompleteKey(c, "Greeting", guestbookKey(c))
	_, err := datastore.Put(c, key, &g)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	http.Redirect(w, gc.Request, "/", http.StatusFound)
}
