# Throne2Speech

Virtual automated commentator service for Nuclear Trhone hosted at [throne2speech.com](http://throne2speech.com)

Uses the Nuclear Throne API to figure out events going on in
your active run, and comments on it in real time.

Supports various personalities and voices, and even multiple
languages.


## Building

You'll need Go installed in your environment, get it from [https://golang.org/dl/](https://golang.org/dl/). Make sure you can run `go` on your CLI before trying to continue.

Tested on Go 1.5.1.

Make sure you get all dependencies and then build it

```
go get github.com/lietu/throne2speech/cmd/throne2speech
cd $GOPATH/src/github.com/lietu/throne2speech/cmd/throne2speech
go build
```

## Dependencies for WWW

Firstly you'll need [Node.js]() and NPM installed. Then you need to install `bower` and `gulp`.

```bash
npm install -g gulp bower
npm install
```

To install 3rd party libraries:

```bash
bower install
```

To compile the SASS stylesheets etc.:

```bash
gulp
```


## Contributing to personalities

In the file `www/js/personalities.js` you'll find examples of
how to define personalities. With very basic understanding of
JavaScript it should be very easy to understand how it works.
 
Basically you create a new copy of e.g. `BoringPersonality` and
customize the texts to your will. You can override the methods
from `Personality` -base class, e.g. `getWeaponName` to add
some flavor to the names of things without adding a "translation".

Finally make sure the new personality has a unique `type` and
is added to the `personalities` -list at the end of the file.


## Translating Throne2Speech

To add a translated commentator you should first create a
localized personality, and think of the sentence structures so
you can use a single form for e.g. weapon names as the language
system doesn't support different forms of words at this time.

Let's take the hypothetical case of creating a new Swedish
translation:

A good starting point would be to copy the `BoringPersonality`
to `SwedishPersonality` in `www/js/personalities.js`, and 
then translating the sentences so they make sense in Swedish.

After that, you should copy `names_english` to `names_swedish.js`
in the `www/js/` -folder and translate the contents.

Make sure you change the `English` on the first line to
`Swedish`, and that the form of the words fits the sentences
the personality will use.

To integrate the changes you can deliver your changes to me
via PasteBin links, GitHub Pull Request, or whatever other
means you can think of.


# Financial support

This project has been made possible thanks to [Cocreators](https://cocreators.ee) and [Lietu](https://lietu.net). You can help us continue our open source work by supporting us on [Buy me a coffee](https://www.buymeacoffee.com/cocreators).

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/cocreators)
