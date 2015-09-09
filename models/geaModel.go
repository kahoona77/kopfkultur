package models

type GaeModel interface {
	SetID(id int64)
	GetID() int64
}
