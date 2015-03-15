package services

import (
	"github.com/kahoona77/kopfkultur/api"
	"github.com/kahoona77/kopfkultur/api/model"
)

func FindAllGaleries(ctx *api.Context) ([]model.Galerie, error) {
	var results []model.Galerie = make([]model.Galerie, 0)
	err := ctx.GaleriesRepo.All(&results)
	ctx.HandleError(err)
	return results, err
}

func GetGalerie(ctx *api.Context, id string) (model.Galerie, error) {
	var galerie model.Galerie
	err := ctx.GaleriesRepo.FindById(id, &galerie)
	ctx.HandleError(err)
	return galerie, err
}

func DeleteGalerie(ctx *api.Context, galerie *model.Galerie) error {
	err := ctx.GaleriesRepo.Remove(galerie.ID)
	ctx.HandleError(err)
	return err
}

func SaveGalerie(ctx *api.Context, galerie *model.Galerie) error {
	_, err := ctx.GaleriesRepo.Save(galerie.ID, galerie)
	ctx.HandleError(err)
	return err
}
