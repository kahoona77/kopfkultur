package models

type Item struct {
	ID          int64   `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Thumb       string  `json:"thumb" datastore:",noindex"`
	Price       float32 `json:"price"`
}

func (i *Item) SetID(id int64) {
	i.ID = id
}

func (i *Item) GetID() int64 {
	return i.ID
}
