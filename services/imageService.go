package services

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kahoona77/kopfkultur/models"
	"golang.org/x/net/context"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/appengine/urlfetch"
	"google.golang.org/cloud"
	"google.golang.org/cloud/storage"

	"google.golang.org/appengine"
	"google.golang.org/appengine/file"
)

//ImageService -
type ImageService struct {
	bucket string
}

func (is *ImageService) getStorageContext(c context.Context) (context.Context, error) {
	is.bucket = "kopf-kultur.appspot.com"
	//check bucket
	if is.bucket == "" {
		var err error
		if is.bucket, err = file.DefaultBucketName(c); err != nil {
			log.Printf("failed to get default GCS bucket name: %v", err)
			return nil, err
		}
	}

	hc := &http.Client{
		Transport: &oauth2.Transport{
			Source: google.AppEngineTokenSource(c, storage.ScopeFullControl),
			Base:   &urlfetch.Transport{Context: c},
		},
	}
	log.Printf("AppID: %v", appengine.AppID(c))
	storageCtx := cloud.WithContext(c, appengine.AppID(c), hc)

	return storageCtx, nil
}

func getImageFileName(image *models.Image) string {
	return fmt.Sprintf("item_image_%d", image.ID)
}

//Save saves a image
func (is *ImageService) Save(gc *gin.Context, image *models.Image) error {
	c := appengine.NewContext(gc.Request)
	ctx, err := is.getStorageContext(c)
	if err != nil {
		return err
	}

	fileName := getImageFileName(image)

	wc := storage.NewWriter(ctx, is.bucket, fileName)
	wc.ContentType = "text/plain"

	if _, err := wc.Write([]byte(image.ImageData)); err != nil {
		log.Printf("createFile: unable to write data to bucket %q, file %q: %v", is.bucket, fileName, err)
		return err
	}

	if err := wc.Close(); err != nil {
		log.Printf("createFile: unable to close bucket %q, file %q: %v", is.bucket, fileName, err)
		return err
	}
	return nil
}

//Load loads a image
func (is *ImageService) Load(gc *gin.Context, image *models.Image) (*models.Image, error) {
	c := appengine.NewContext(gc.Request)
	ctx, err := is.getStorageContext(c)
	if err != nil {
		return nil, err
	}
	fileName := getImageFileName(image)

	rc, err := storage.NewReader(ctx, is.bucket, fileName)
	if err != nil {
		log.Printf("readFile: unable to open file from bucket %q, file %q: %v", is.bucket, fileName, err)
		return nil, err
	}
	defer rc.Close()

	data, err := ioutil.ReadAll(rc)
	image.ImageData = string(data[:])

	return image, nil
}

//Delete deletes a image
func (is *ImageService) Delete(gc *gin.Context, image *models.Image) error {
	c := appengine.NewContext(gc.Request)
	ctx, err := is.getStorageContext(c)
	if err != nil {
		return err
	}
	fileName := getImageFileName(image)

	err = storage.DeleteObject(ctx, is.bucket, fileName)
	if err != nil {
		log.Printf("deleteFile: unable to delete file from bucket %q, file %q: %v", is.bucket, fileName, err)
		return err
	}
	return nil
}
