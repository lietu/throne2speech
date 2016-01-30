package throne2speech

import (
	"fmt"
	"errors"
	"time"
	"io/ioutil"
	"log"
	"strings"
	"net/http"
	"encoding/json"
	"github.com/nu7hatch/gouuid"
)

var CHECK_FREQUENCY time.Duration = 5 * time.Second

type ApiSubscriber struct {
	ClientUUID      uuid.UUID
	SteamId64       string
	StreamKey       string
	done            chan bool
	runData         *RunData
	runStats	    *RunStats
	running			bool
	invalidSettings bool
}

func (as *ApiSubscriber) onWeaponPickup(weaponId int) {
	as.SendProgressEvent(NewWeaponPickup(weaponId))

	weapon := Weapons[weaponId]
	log.Printf("Player %s picked up %s", as.SteamId64, weapon)
}

func (as *ApiSubscriber) onNewMutation(mutationId int) {
	as.SendProgressEvent(NewMutation(mutationId))
	mutation := Mutations[mutationId]
	log.Printf("Player %s took %s", as.SteamId64, mutation)
}

func (as *ApiSubscriber) onNewUltra(character int, ultra int) {
	as.SendProgressEvent(NewUltraMutation(character, ultra))
	characterText := Characters[as.runData.Character]

	log.Printf("Player %s got %s ultra %d", as.SteamId64, characterText, ultra)
}

func (as *ApiSubscriber) onNewCrown(crownId int) {
	as.SendProgressEvent(NewCrownChoice(crownId))
	crown := Crowns[crownId]
	log.Printf("Player %s chose %s", as.SteamId64, crown)
}

func (as *ApiSubscriber) onDeath(rd *RunData) {
	as.SendProgressEvent(NewDeath(rd.LastDamagedBy))
	enemy := Enemies[rd.LastDamagedBy]
	level := rd.Level
	log.Printf("Player %s died to a %s on %s", as.SteamId64, enemy, level)
}

func (as *ApiSubscriber) onHurt(enemyId int) {
	as.SendProgressEvent(NewHurt(enemyId))
	enemy := Enemies[enemyId]
	log.Printf("Player %s was hurt by a %s", as.SteamId64, enemy)
}

func (as *ApiSubscriber) onHealed(amount int) {
	as.SendProgressEvent(NewHealed(amount))
	log.Printf("Player %s was healed by %d points", as.SteamId64, amount)
}

func (as *ApiSubscriber) onNewRun(rd *RunData) {
	character := Characters[rd.Character]
	log.Printf("Player %s started a new run with %s", as.SteamId64, character)
}

func (as *ApiSubscriber) onNewLevel(rd *RunData) {
	as.SendProgressEvent(NewLevelEnter(rd.World, rd.Area, rd.Loop))
	log.Printf("Player %s entered level %s", as.SteamId64, rd.Level)
}

func (as *ApiSubscriber) processUpdate(rdc *RunDataContainer) {
	current := rdc.Current
	previous := rdc.Previous

	// Has the player died?
	if previous.Timestamp > 0 && previous.Timestamp == as.runData.Timestamp {
		as.onDeath(previous)
		as.runData.Timestamp = 0
	}

	// If we have a current run
	if rdc.Current.Timestamp > 0 {
		if as.running == false {
			as.runStats.Healed(8)
			as.onNewRun(current)
			as.onNewLevel(current)
			as.running = true
		} else {
			for _, v := range current.Weapons {
				if as.runStats.WeaponPickup(v) {
					as.onWeaponPickup(v)
				}
			}

			for _, v := range current.Mutations {
				if as.runStats.MutationChoice(v) {
					as.onNewMutation(v)
				}
			}

			if as.runStats.CrownChoice(current.Crown) {
				as.onNewCrown(current.Crown)
			}

			if as.runStats.UltraChoice(current.Ultra) {
				as.onNewUltra(current.Character, current.Ultra)
			}

			if as.runStats.Hurt(current.LastDamagedBy) {
				as.onHurt(current.LastDamagedBy)
			}

			amount := as.runStats.Healed(current.Health)
			if amount > 0 {
				as.onHealed(amount)
			}

			// Reached new level
			if as.runData.Level != current.Level {
				as.onNewLevel(current)
			}
		}

		as.runData = rdc.Current
	} else {
		as.running = false
	}
}

func (as *ApiSubscriber) getData() ([]byte, error) {
	url := fmt.Sprintf("https://tb-api.xyz/stream/get?s=%s&key=%s", as.SteamId64, strings.ToUpper(as.StreamKey))

	resp, err := http.Get(url)

	if err != nil {
		log.Printf("API error: %s", err)
		return nil, errors.New("API error")
	}

	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		log.Printf("Error reading API response: %s", err)
		return nil, errors.New("API error")
	}

	invalidSettings := false
	if resp.StatusCode != 200 {
		invalidSettings = true
	}

	if strings.Contains(string(body[:]), "<html>") {
		invalidSettings = true
	}

	if invalidSettings {
		if as.invalidSettings == false {
			msg := fmt.Sprintf("Could not get data with the provided Steam ID and Stream Key. Have you done any runs that would've gotten recorded?")
			as.SendMessage("Invalid settings?", msg, "")
			as.invalidSettings = true
		}
		return nil, errors.New("API error")
	}

	return body, nil
}

func (as *ApiSubscriber) poll() {
	body, err := as.getData()

	if err != nil {
		return
	}

	response := NewApiResponse()

	err = json.Unmarshal(body, &response)
	if err != nil {
		log.Printf("JSON error decoding API response: %s", err)
		log.Printf("%s", string(body[:]))
		return
	}

	data := response.ToRunData()
	as.processUpdate(data)
}

func (as *ApiSubscriber) run() {
	start := time.Now()

	as.poll()

	for {
		select {
		case <-as.done:
			log.Printf("ApiSubscriber for %s stopping.", as.SteamId64)
			return

		default:
			elapsed := time.Since(start)

			if elapsed > CHECK_FREQUENCY {
				start = time.Now()
				as.poll()
			} else {
				time.Sleep(100 * time.Millisecond)
			}
		}
	}
}

func (as *ApiSubscriber) Start() {
	go as.run()
}

func (as *ApiSubscriber) Stop() {
	log.Printf("Asking ApiSubscriber for %s to stop.", as.SteamId64)
	as.done <- true
}

func (as *ApiSubscriber) SendMessage(header string, content string, icon string) {
	m := MessageOut{
		"message",
		header,
		content,
		icon,
	}

	SendToConnection(as.ClientUUID, m.ToJson())
}

func (as *ApiSubscriber) SendProgressEvent(pe ProgressEvent) {
	tpl := `{
	"type": "ProgressEvent",
	"data": %s
}`

	s := fmt.Sprintf(tpl, pe.ToJson())

	SendToConnection(as.ClientUUID, []byte(s))
}

func NewApiSubscriber(uuid uuid.UUID, steamId64 string, streamKey string) ApiSubscriber {
	as := ApiSubscriber{
		uuid,
		steamId64,
		streamKey,
		make(chan bool),
		NewRunData(),
		NewRunStats(),
		false,
		false,
	}

	return as
}
