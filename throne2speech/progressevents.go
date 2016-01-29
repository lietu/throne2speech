package throne2speech

import (
	"log"
	"encoding/json"
)

type ProgressEvent interface {
	ToJson() []byte
}

// Weapon
type WeaponPickup struct {
	Action   string   `json:"action"`
	WeaponId int      `json:"weaponId"`
}

func NewWeaponPickup(weaponId int) ProgressEvent {
	event := WeaponPickup{
		"WeaponPickup",
		weaponId,
	}

	return &event
}

func (wp *WeaponPickup) ToJson() []byte {
	result, err := json.Marshal(&wp)

	if err != nil {
		log.Fatalf("error: %v", err)
	}

	return result
}

// Mutation
type Mutation struct {
	Action     string   `json:"action"`
	MutationId int      `json:"mutationId"`
}

func NewMutation(mutationId int) ProgressEvent {
	event := Mutation{
		"Mutation",
		mutationId,
	}

	return &event
}

func (m *Mutation) ToJson() []byte {
	result, err := json.Marshal(&m)

	if err != nil {
		log.Fatalf("error: %v", err)
	}

	return result
}


// Ultra Mutation
type UltraMutation struct {
	Action      string   `json:"action"`
	CharacterId int      `json:"characterId"`
	Ultra       int      `json:"ultra"`
}

func NewUltraMutation(characterId int, ultra int) ProgressEvent {
	event := UltraMutation{
		"UltraMutation",
		characterId,
		ultra,
	}

	return &event
}

func (m *UltraMutation) ToJson() []byte {
	result, err := json.Marshal(&m)

	if err != nil {
		log.Fatalf("error: %v", err)
	}

	return result
}


// Crown
type CrownChoice struct {
	Action      string   `json:"action"`
	CrownId     int      `json:"crownId"`
}

func NewCrownChoice(crownId int) ProgressEvent {
	event := CrownChoice{
		"CrownChoice",
		crownId,
	}

	return &event
}

func (m *CrownChoice) ToJson() []byte {
	result, err := json.Marshal(&m)

	if err != nil {
		log.Fatalf("error: %v", err)
	}

	return result
}


// Level
type LevelEnter struct {
	Action string   `json:"action"`
	World  int      `json:"world"`
	Area   int      `json:"area"`
	Loop   int      `json:"loop"`
}

func NewLevelEnter(world int, area int, loop int) ProgressEvent {
	event := LevelEnter{
		"LevelEnter",
		world,
		area,
		loop,
	}

	return &event
}

func (le *LevelEnter) ToJson() []byte {
	result, err := json.Marshal(&le)

	if err != nil {
		log.Fatalf("error: %v", err)
	}

	return result
}



// Death
type Death struct {
	Action string   `json:"action"`
	Enemy  int      `json:"enemyId"`
}

func NewDeath(enemyId int) ProgressEvent {
	event := Death{
		"Death",
		enemyId,
	}

	return &event
}

func (le *Death) ToJson() []byte {
	result, err := json.Marshal(&le)

	if err != nil {
		log.Fatalf("error: %v", err)
	}

	return result
}


// Death
type Hurt struct {
	Action string   `json:"action"`
	Enemy  int      `json:"enemyId"`
}

func NewHurt(enemyId int) ProgressEvent {
	event := Death{
		"Hurt",
		enemyId,
	}

	return &event
}

func (le *Hurt) ToJson() []byte {
	result, err := json.Marshal(&le)

	if err != nil {
		log.Fatalf("error: %v", err)
	}

	return result
}

