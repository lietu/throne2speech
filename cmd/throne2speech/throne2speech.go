package main

import (
	"log"
	"github.com/lietu/throne2speech/throne2speech"
)

func main() {
	settings := throne2speech.GetServerSettings()
	throne2speech.RunServer(settings)
	log.Fatalf("Exiting...")
}
