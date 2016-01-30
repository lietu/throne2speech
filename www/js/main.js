$(function () {
    var DefaultPersonality = Bastion;

    var Popup = extend(Class, {
        initialize: function (throneStats, header, content, lifetime, icon) {
            log("Showing popup: ", header, content);
            this.throneStats = throneStats;

            this.$element = this.throneStats.$popupTemplate.clone();

            if (this.throneStats.settings.overlaySize != "normal") {
                this.$element.addClass(this.throneStats.settings.overlaySize);
            }

            this.view = rivets.bind(this.$element, {
                header: header,
                content: content
            });

            if (icon) {
                var $icon = this.$element.find(".icon")
                $icon.attr("class", "icon custom");
                $("<i>").css("background-image", "url(" + icon + ")").addClass("custom").appendTo($icon);
            }

            this.$element.css("display", "none");
            this.$element.prependTo("#popups");
            this.$element.slideDown();

            if (!lifetime) {
                if (this.throneStats.settings.popupLifetime) {
                    lifetime = this.throneStats.settings.popupLifetime;
                }
            }

            if (lifetime) {
                setTimeout(this.close.bind(this), lifetime);
            }
        },

        close: function () {
            log("Removing popup");
            this.view.unbind();
            this.$element.fadeOut({
                complete: function () {
                    this.$element.remove();
                }.bind(this)
            });
        }
    });

    var Throne2Speech = extend(Class, {
        initialize: function () {
            this.$popupTemplate = $($('#message-template').html());
            this.$content = $("#content");

            this.defaultSettings = {
                steamId64: null,
                streamKey: null,
                popupLifetime: 15000,
                dataEndpoint: "data",
                overlaySize: "normal",
                view: "information",
                volume: 75,
                personality: null,
                voice: null
            };

            this.subscribed = false;
            this.settings = this.defaultSettings;
            this.contentView = null;
            this.websocket = null;

            this.personality = null;
            this._say(" ", {volume: 0});
        },

        /**
         * Start the webapp
         */
        start: function () {
            log("Starting up...");

            // Setup Semantic UI modals
            $(".ui.modal").modal();

            this.updateSettings(this.parseSettings());

            log("Got settings: ", this.settings);

            var personalityArray = [];
            for (var key in personalities) {
                if (!this.settings.personality) {
                    this.settings.personality = key;
                }
                log(personalities[key].name)
                personalityArray.push({
                    key: key,
                    name: personalities[key].type
                })
            }

            var voices = responsiveVoice.getVoices();
            for (var i = 0, count = voices.length; i < count; i += 1) {
                if (!this.settings.voice) {
                    this.settings.voice = voices[i].name;
                    break;
                }
            }

            this.contentView = rivets.bind(this.$content, {
                settings: this.settings,
                personalities: personalityArray,
                voices: voices,
                ui: {
                    showInformation: function () {
                        this.showView("information");
                    }.bind(this),
                    showVirtualCommentator: function () {
                        this.showView("virtual-commentator");
                    }.bind(this),
                    playVideo: this.playVideo.bind(this),
                    goToView: this.goToView.bind(this),
                    startCommentator: this.startCommentator.bind(this),
                    stopCommentator: this.stopCommentator.bind(this),
                    steamId64HelpVisible: false,
                    streamKeyHelpVisible: false,
                    testCommentator: this.testCommentator.bind(this)
                }
            });

            this.connect();

            this.showView();
            window.addEventListener("hashchange", this._onHashChange.bind(this), false);
        },

        /**
         * Update data from new settings
         *
         * @param settings
         */
        updateSettings: function (settings) {
            this.settings = settings;

            if (this.settings.view === null) {
                this.settings.view = this.defaultSettings.view;
            }
        },

        /**
         * Parse settings from URL hash
         *
         * @param {String} hash
         */
        parseSettings: function (hash) {
            hash = hash || window.location.hash;

            var settings = JSON.parse(JSON.stringify(this.defaultSettings));

            var args = String(hash).substr(1).split("&");

            for (var i = 0, count = args.length; i < count; ++i) {
                var arg = args[i];
                var equals = arg.indexOf("=");
                var key = arg.substr(0, equals);
                settings[key] = arg.substr(equals + 1);
            }

            return settings;
        },

        /**
         * Merge settings so no existing data is lost
         *
         * @param old
         * @param settings
         */
        mergeSettings: function (old, settings) {
            var newSettings = {};
            var key;

            for (key in settings) {
                if (settings.hasOwnProperty(key)) {
                    newSettings[key] = settings[key];
                }
            }

            for (key in old) {
                if (old.hasOwnProperty(key) && !newSettings[key]) {
                    newSettings[key] = old[key];
                }
            }

            return newSettings;
        },

        /**
         * Get current location, hash-free
         *
         * @return {string}
         */
        getLocation: function () {
            var location = String(window.location);
            var pos = location.indexOf("#");
            if (pos !== -1) {
                location = location.substr(0, pos);
            }

            return location;
        },

        /**
         * Convert settings object to an URL
         *
         * @param settings
         */
        settingsToUrl: function (settings) {
            settings = settings || this.settings;
            var args = [];

            for (var key in settings) {
                if (settings.hasOwnProperty(key) && key != "" && key.substr(0, 1) !== "_") {
                    if (settings[key] !== this.defaultSettings[key]) {
                        args.push(key + "=" + settings[key]);
                    }
                }
            }

            var url = this.getLocation();

            if (args.length > 0) {
                url = url + "#" + args.join("&");
            }

            log("URL: " + url);

            return url
        },

        /**
         * Check if overlay settings are good to go, optionally displays help.
         *
         * @param settings
         * @param showHelp
         * @returns {boolean}
         */
        checkSettings: function (settings, showHelp) {

            if (!this.streamKeyOk(settings.streamKey)) {
                log("Stream key " + settings.streamKey + " looks invalid");
                if (showHelp) {
                    $("#streamKeyHelp").modal("show");
                }
            } else if (!this.steamId64Ok(settings.steamId64)) {
                log("Steam ID 64 " + settings.steamId64 + " looks invalid");
                if (showHelp) {
                    $("#steamId64Help").modal("show");
                }
            } else {
                log("Settings ok");
                return true;
            }

            log("Settings NOT ok");
            return false;
        },

        /**
         * Display a view
         *
         * @param {String} view "overlay" or one of the content area tab names
         */
        showView: function (view) {
            if (view) {
                this.settings.view = view;
            }

            log("Was asked to show view " + this.settings.view);

            this._showContentView(this.settings.view);
        },

        /**
         * Click on a link that's supposed to go to a view
         */
        goToView: function (event) {
            var $target = $(event.target);

            var targetSettings = this.parseSettings($target.attr("href"));

            this.updateSettings(this.mergeSettings(this.settings, targetSettings));
            this.showView();

            // Never do what the link normally does -> navigate uncontrollably
            event.preventDefault();
            return false;
        },

        /**
         * Show a popup message
         *
         * @param {String} header Title text
         * @param {String} content Content body
         * @param {Number} lifetime Time in milliseconds to display popup
         * @param {String} icon The icon to show
         */
        popup: throttle(function (header, content, lifetime, icon) {
            Popup.create(this, header, content, lifetime, icon);
        }, 3000),

        /**
         * Play the video (click on screenshot)
         */
        playVideo: function () {
            log("Play video");
            $("#video-preview").hide();
            $("#video").removeClass("hidden");
        },

        _createRandomProgressEvent: function () {
            var event = {
                action: choose(["WeaponPickup", "Mutation", "CrownChoice", "LevelEnter"])
            };

            switch (event.action) {
                case "WeaponPickup":
                    event.weaponId = choose(WEAPON_IDS);
                    break;
                case "Mutation":
                    event.mutationId = choose(MUTATION_IDS);
                    break;
                case "CrownChoice":
                    event.crownId = choose(CROWN_IDS);
                    break;
                case "LevelEnter":
                    var props = choose([
                        {world: 1, area: 1, loop: 0},
                        {world: 1, area: 3, loop: 0},
                        {world: 2, area: 1, loop: 0},
                        {world: 3, area: 1, loop: 0},
                        {world: 3, area: 3, loop: 0},
                        {world: 4, area: 1, loop: 0},
                        {world: 5, area: 1, loop: 0},
                        {world: 5, area: 3, loop: 0},
                        {world: 6, area: 1, loop: 0},
                        {world: 7, area: 1, loop: 0},
                        {world: 7, area: 3, loop: 0}
                    ]);
                    for (var key in props) {
                        event[key] = props[key];
                    }
            }

            return event;
        },

        testCommentator: function () {
            this.personality = personalities[this.settings.personality];
            this._processProgressEvent(this._createRandomProgressEvent());
        },

        startCommentator: function () {
            if (this.checkSettings(this.settings, true)) {
                this.personality = personalities[this.settings.personality];
                this.subscribe();
            }
        },

        stopCommentator: function () {
            // TODO:
        },

        /**
         * Connect to backend
         *
         * @param callback
         */
        connect: function (callback) {
            var proto = (location.protocol === "https:" ? "wss://" : "ws://");
            var port = window.location.port;
            if (port === "") {
                port = (proto === "wss://" ? 443 : 80);
            }
            var server = proto + window.location.hostname + ":" + port + "/" + this.settings.dataEndpoint;

            log("Connecting to " + server);

            this.websocket = new WebSocket(server);
            this.websocket.onmessage = this._onMessage.bind(this);
            this.websocket.onerror = this._onError.bind(this);
            this.websocket.onclose = this._onClose.bind(this);
            this.websocket.onopen = function (event) {
                this._onOpen(event);

                if (callback) {
                    callback();
                }
            }.bind(this);
        },

        /**
         * Subscribe to receive live stats events from backend
         */
        subscribe: function () {

            if (!this.checkSettings(this.settings)) {
                log("Not subscribing, settings are not OK");
                return;
            }

            log("Subscribing to user " + this.settings.steamId64 + " with stream key " + this.settings.streamKey);

            if (this.websocket.readyState === 1) {
                this.websocket.send(JSON.stringify({
                    type: "subscribe",
                    steamId64: this.settings.steamId64,
                    streamKey: this.settings.streamKey
                }));
                this.subscribed = true;
            } else {
                setTimeout(this.subscribe.bind(this), 250);
            }
        },

        /**
         * Check if stream key looks good
         *
         * @param streamKey
         * @returns {boolean}
         */
        streamKeyOk: function (streamKey) {
            // ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y', 'Z', '2', '6', '8', '4']
            return /^[a-zA-Z0-9]{9}$/.test(streamKey);
        },

        /**
         * Check if Steam ID 64 looks good
         *
         * @param steamId64
         * @returns {boolean}
         */
        steamId64Ok: function (steamId64) {
            return /^[0-9]{17}$/.test(steamId64);
        },

        /*
         * Private methods, shouldn't be called unless you know what you're doing
         */


        /**
         * Show a content view, should NOT be called outside of showView()
         *
         * @param {String} view
         * @private
         */
        _showContentView: function (view) {
            log("Showing content view " + view);

            $("body").addClass("background");

            this._switchTab(view);
        },


        /**
         * Switch active tab in content view
         * @param {String} view
         */
        _switchTab: function (view) {
            if (view != this.activeView) {
                $(".tabular.menu .item").removeClass("active");
                $("#information, #virtual-commentator").removeClass("active");

                var tab = "#" + view + "-tab";
                var selector = "#" + view + ", " + tab;

                $(selector).addClass("active");

                $("html, body").animate({
                    scrollTop: $(tab).offset().top
                }, 150);

                this.activeView = view;
            }
        },

        /*
         * Event handlers, should never be called manually
         */


        /**
         * Triggered when location hash changes
         *
         * @param event
         * @private
         */
        _onHashChange: function (event) {
            var newURL = event.newURL;

            log("Hash change detected, new URL: " + newURL);

            var pos = newURL.indexOf("#");
            if (pos !== -1) {
                var hash = newURL.substr(pos);
                this.updateSettings(this.mergeSettings(this.settings, this.parseSettings(hash)));
                this.showView();
            }
        },

        /**
         * Triggered when connection to backend is established
         *
         * @param event
         * @private
         */
        _onOpen: function (event) {
            log("Connected to server");
        },

        /**
         * Triggered when backend sends messages to us
         *
         * @param event
         * @private
         */
        _onMessage: function (event) {
            var data = JSON.parse(event.data);

            if (data.type === "message") {
                log("Got message", data);
                this.popup(data.header, data.content, null, data.icon != "" ? data.icon : null);
            } else if (data.type === "ProgressEvent") {
                this._processProgressEvent(data.data);
            } else {
                log("Got unsupported message?", data);
            }
        },

        /**
         * Triggered when there is an error with the backend connection
         *
         * @private
         */
        _onError: function () {
            log("Error", arguments);
        },

        /**
         * Triggered when connection to backend was closed
         *
         * @private
         */
        _onClose: function () {
            log("Connection closed!");
            if (this.subscribed) {
                this.popup("Connection issues!", "Trying to reconnect to server.", 2500);
            }
            setTimeout(function () {
                this.connect(function () {
                    if (this.subscribed) {
                        this.subscribe();
                    }
                }.bind(this));
            }.bind(this), 3000);
        },

        _processProgressEvent: function (eventData) {
            var text = this.personality.getMessage(eventData);
            if (text) {
                this._say(text);
            }
        },

        /**
         * Say stuff
         * @param {String} text
         * @private
         */
        _say: function (text, options) {
            log("Saying: " + text);
            options = options || {};
            options.volume = this.settings.volume / 100;

            responsiveVoice.speak(text, this.settings.voice, options);
        }
    });

    var ts = Throne2Speech.create();
    ts.start();

    // For access via console
    window.ts = ts;
});