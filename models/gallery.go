package models

type Gallery struct {
	ID          int64     `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Sections    []Section `json:"sections"`
}

func (g *Gallery) SetID(id int64) {
	g.ID = id
}

func (g *Gallery) GetID() int64 {
	return g.ID
}

type Section struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Position    int    `json:"position"`
}
