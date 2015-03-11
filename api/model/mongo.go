package model

import (
	"fmt"
	"os"
	"strconv"

	"log"

	"github.com/pelletier/go-toml"
	"labix.org/v2/mgo"
	"labix.org/v2/mgo/bson"
)

const database string = "xtv"

type MongoDB struct {
	Session  *mgo.Session
	database string
}

func CreateMongoDB(config *toml.TomlTree) *MongoDB {
	ms := new(MongoDB)

	//creating db
	url := getDbUrl(config)
	log.Printf("connecting to mongo %v \n", url)
	session, err := mgo.Dial(url) // mgo.Dial("192.168.56.101") //mgo.Dial("localhost")
	if err != nil {
		panic(err)
	}

	ms.Session = session
	ms.database = config.Get("database.database").(string)
	return ms
}

func getDbUrl(config *toml.TomlTree) string {
	useConfig, _ := strconv.ParseBool(config.Get("general.use_config").(string))

	if useConfig == true {
		host := config.Get("database.host").(string)
		return fmt.Sprintf("mongodb://%s/", host)
	}

	user := config.Get("database.user").(string)
	password := config.Get("database.password").(string)

	return fmt.Sprintf("mongodb://%s:%s@%s:%s/", user, password, os.Getenv("OPENSHIFT_MONGODB_DB_HOST"), os.Getenv("OPENSHIFT_MONGODB_DB_PORT"))
}

func (ms *MongoDB) Close() {
	ms.Session.Close()
}

func (ms *MongoDB) GetRepo(collection string) *Repository {
	return NewRepository(ms.Session, ms.database, collection)
}

// ++++++ Repository +++++++++++

type Repository struct {
	Collection *mgo.Collection
}

func NewRepository(session *mgo.Session, database string, collectionName string) *Repository {
	repo := new(Repository)
	repo.Collection = session.DB(database).C(collectionName)
	return repo
}

func (this Repository) All(results interface{}) error {
	return this.Collection.Find(nil).All(results)
}

func (this Repository) CountAll() (int, error) {
	return this.Collection.Find(nil).Count()
}

func (this Repository) FindWithQuery(query *bson.M, results interface{}) error {
	return this.Collection.Find(query).All(results)
}

func (this Repository) FindById(docId string, result MongoDomain) error {
	return this.Collection.FindId(docId).One(result)
}

func (this Repository) FindFirst(result MongoDomain) error {
	return this.Collection.Find(nil).One(result)
}

func (this Repository) Remove(docId string) error {
	return this.Collection.RemoveId(docId)
}

func (this Repository) RemoveAll(query *bson.M) (info *mgo.ChangeInfo, err error) {
	return this.Collection.RemoveAll(query)
}

func (this Repository) Save(docId string, doc MongoDomain) (info *mgo.ChangeInfo, err error) {
	if docId == "" {
		docId = bson.NewObjectId().Hex()
		doc.SetID(docId)
	}
	return this.Collection.UpsertId(docId, doc)
}
