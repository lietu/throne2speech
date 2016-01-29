package throne2speech

type MessageIn struct {
	Type      string    `json:"type"`
	SteamId64 string    `json:"steamId64"`
	StreamKey string    `json:"streamKey"`
}

