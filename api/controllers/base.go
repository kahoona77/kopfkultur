package controllers

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/zenazn/goji"
	"github.com/zenazn/goji/web"
	"rhcloud.com/kahoona77/kopfkultur/api"
	"rhcloud.com/kahoona77/kopfkultur/api/response"
)

//InitRoutes - inits all controller routes
func InitRoutes() {
	// GaleriesController
	galeriesController := &GaleriesController{}
	goji.Get("/api/galeries/loadGalleries", route(galeriesController.Load))
	goji.Get("/api/galeries/get/:id", route(galeriesController.Get))
	goji.Post("/api/galeries/save", route(galeriesController.Save))
	goji.Post("/api/galeries/delete", route(galeriesController.Delete))
}

func route(handler func(c web.C, req *http.Request) (res *response.Response, err error)) interface{} {
	fn := func(c web.C, w http.ResponseWriter, req *http.Request) {
		//fmt.Printf("handling request to %v", req.URL.String())
		res, err := handler(c, req)

		if err != nil {
			handleError(c, w, res, err)
			return
		}

		handleResponse(c, w, res)
	}
	return fn
}

func handleResponse(c web.C, w http.ResponseWriter, response *response.Response) {
	json.NewEncoder(w).Encode(response)
}

func handleError(c web.C, w http.ResponseWriter, response *response.Response, err error) {
	json.NewEncoder(w).Encode(response)
}

func readJSON(req *http.Request, field string, v interface{}) error {
	defer req.Body.Close()
	decoder := json.NewDecoder(req.Body)

	result := map[string]*json.RawMessage{}

	err := decoder.Decode(&result)
	if err != nil {
		return errors.New("ReadJson couldn't read request body " + err.Error())
	}

	json.Unmarshal(*result[field], &v)

	return nil
}

func ctx(c web.C) *api.Context {
	return c.Env["ctx"].(*api.Context)
}
