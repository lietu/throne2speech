@echo off

rem
rem Build and run the app
rem
rem So Windows stops nagging about firewall stuff all the time
rem like it does with "go run throne2speech.go"
rem

del throne2speech.exe
go build
throne2speech
