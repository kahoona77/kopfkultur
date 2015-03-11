package controllers

import (
	"net/http"

	"github.com/zenazn/goji/web"

	"rhcloud.com/kahoona77/kopfkultur/api/model"
	"rhcloud.com/kahoona77/kopfkultur/api/response"
	"rhcloud.com/kahoona77/kopfkultur/api/services"
)

// GaleriesController - ...
type GaleriesController struct {
}

//Load - loads all galeries
func (controller *GaleriesController) Load(c web.C, r *http.Request) (*response.Response, error) {
	galeries, err := services.FindAllGaleries(ctx(c))
	if err != nil {
		return response.Error(err), err
	}

	return response.OK(galeries), nil
}

//Get - gets the galerie by it's ID
func (controller *GaleriesController) Get(c web.C, r *http.Request) (*response.Response, error) {
	id := c.URLParams["id"]

	var galerie, err = services.GetGalerie(ctx(c), id)
	if err != nil {
		return response.Error(err), err
	}

	return response.OK(galerie), nil
}

//Save - save the galerie from the params
func (controller *GaleriesController) Save(c web.C, r *http.Request) (*response.Response, error) {
	var galerie model.Galerie
	err := readJSON(r, "galerie", &galerie)
	if err != nil {
		return response.Error(err), err
	}

	err = services.SaveGalerie(ctx(c), &galerie)
	if err != nil {
		return response.Error(err), err
	}

	return response.OK(nil), nil
}

//Delete - deletes the galerie from the params
func (controller *GaleriesController) Delete(c web.C, r *http.Request) (*response.Response, error) {
	var galerie model.Galerie
	err := readJSON(r, "galerie", &galerie)
	if err != nil {
		return response.Error(err), err
	}

	err = services.DeleteGalerie(ctx(c), &galerie)
	if err != nil {
		return response.Error(err), err
	}

	return response.OK(nil), nil
}
