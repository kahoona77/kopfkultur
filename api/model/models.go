package model

type MongoDomain interface {
	SetID(id string)
}

type Galerie struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Sections    []Section `json:"sections"`
}

func (g *Galerie) SetID(id string) {
	g.ID = id
}

type Section struct {
	Postion     int    `json:"position"`
	Name        string `json:"name"`
	Description string `json:"description"`
}
