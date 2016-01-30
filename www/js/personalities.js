function motherfuckerify(callback) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        var result = callback.apply(this, args);
        if (result) {
            result = "motherfucking " + result;
        }
        return result;
    }
}

var Personality = extend(Class, {
    getEnemyName: function (enemyId) {
        return NAMES.causesOfDeath[enemyId];
    },

    getWeaponName: function (weaponId) {
        return NAMES.weaponChoices[weaponId];
    },

    getCrownName: function (crownId) {
        return NAMES.crownChoices[crownId];
    },

    getMutationName: function (mutationId) {
        return NAMES.mutationChoices[mutationId];
    },

    getUltraMutationName: function (characterId, ultra) {
        return ULTRAS[characterId][ultra];
    },

    getWorldName: function (world) {
        return WORLDS[world];
    },

    getBossName: function (world, area, loop) {
        if (loop > 0) {
            switch (world) {
                case 2:
                    return "Ball mom";
                case 4:
                    return "Hyper crystal";
                case 6:
                    return "Technomancer";
            }
        }

        if (area === 3) {
            switch (world) {
                case 1:
                    return "Big Bandit";
                case 3:
                    return "Big Dog";
                case 5:
                    return "Little Hunter";
                case 7:
                    return "Nuclear Throne";
                case 106:
                    return "Captain";
            }
        }

        // TODO: Throne 2 and Captain
    },

    getPrefix: function (word) {
        return AvsAn.query(word).article
    },

    getMessage: function (event) {
        if (!event.action) {
            log(event);
            return;
        }

        var method = "on" + event.action;
        if (this[method]) {
            return this[method](event);
        } else {
            log(T("{type} personality doesn't support action {action}", {
                type: this.type,
                action: event.action
            }));
        }
    }
});

var BoringPersonality = extend(Personality, {
    type: "Boring McBoringson",

    healed: [
        {rarity: 1, result: null},
        {rarity: 1.5, result: "Oh yeah"},
        {rarity: 1.5, result: "Nice"},
        {rarity: 1.5, result: "Great"},
        {rarity: 1.5, result: "Fantastic"},
        {rarity: 1.5, result: "Awesome"},
        {rarity: 3, result: "Thanks for the health"},
        {rarity: 3, result: "Finally some health"},
        {rarity: 3, result: "That hit the spot"}
    ],

    hurt: [
        {rarity: 0.5, result: null},
        {rarity: 1, result: "Ouch"},
        {rarity: 1, result: "Ow"},
        {rarity: 1, result: "Ugh"},
        {rarity: 1, result: "Oof"},
        {rarity: 2, result: "Got hit by {a} {enemy}"}
    ],

    death: [
        {rarity: 1, result: "Died to {a} {enemy}"}
    ],

    onWeaponPickup: function (event) {
        var name = this.getWeaponName(event.weaponId);

        return T("Picked up {a} {weapon}", {
            a: this.getPrefix(name),
            weapon: name
        });
    },

    onMutation: function (event) {
        var mutation = this.getMutationName(event.mutationId);
        return T("Chose {mutation}", {
            mutation: mutation
        });
    },

    onUltraMutation: function (event) {
        var ultra = this.getUltraMutationName(event.characterId, event.ultra);
        return T("Chose {ultra}", {
            ultra: ultra
        });
    },

    onCrownChoice: function (event) {
        var crown = this.getCrownName(event.crownId);
        return T("Chose {crown}", {
            crown: crown
        });
    },

    onHurt: function (event) {
        var enemy = this.getEnemyName(event.enemyId);
        return T(pick(this.hurt), {
            a: this.getPrefix(enemy),
            enemy: enemy
        });
    },

    onHealed: function (event) {
        return T(pick(this.healed), {
            amount: event.amount
        })
    },

    onDeath: function (event) {
        var enemy = this.getEnemyName(event.enemyId);
        return T(pick(this.death), {
            a: this.getPrefix(enemy),
            enemy: enemy
        });
    },

    onLevelEnter: function (event) {
        var boss = this.getBossName(event.world, event.area, event.loop);
        if (boss) {
            return T("Entered {boss} level", {
                boss: boss
            });
        } else if (event.area === 1) {
            var world = this.getWorldName(event.world);

            if (world) {
                return T("Entered the {world}", {
                    world: world
                });
            }
        }
    }
});

var SamuelLJackson = extend(BoringPersonality, {
    type: "Samuel L. Jackson",

    healed: BoringPersonality.healed,

    hurt: append(BoringPersonality.hurt, [
        {rarity: 2, result: "Motherfucker bit me"},
        {
            rarity: 3,
            result: "I've had it with these {enemy}s in this motherfucking level"
        }
    ]),

    death: append(BoringPersonality.death, [
        {rarity: 4, result: "Fuck you"},
        {rarity: 4, result: "Come on"},
        {rarity: 4, result: "Wake the fuck up"},
        {rarity: 4, result: "Ahh that hit the spot"},
        {rarity: 4, result: "Oh I'm sorry did I break your concentration"},
        {
            rarity: 4,
            result: "See I told you you should've killed that bitch"
        },
        {
            rarity: 4,
            result: "I don't remember asking you a god damn thing"
        }
    ]),

    vaults: [
        {
            rarity: 1,
            result: "Crown Vault ain't no country I've ever heard of. They speak English in Vaults?"
        },
        {
            rarity: 2,
            result: "I've had it with these motherfucking vaults in this motherfucking game."
        }
    ],

    getCrownName: motherfuckerify(BoringPersonality.getCrownName),
    getEnemyName: motherfuckerify(BoringPersonality.getEnemyName),
    getWeaponName: motherfuckerify(BoringPersonality.getWeaponName),
    getMutationName: motherfuckerify(BoringPersonality.getMutationName),
    getUltraMutationName: motherfuckerify(BoringPersonality.getUltraMutationName),
    getWorldName: motherfuckerify(BoringPersonality.getWorldName),
    getBossName: motherfuckerify(BoringPersonality.getBossName),

    onLevelEnter: function (event) {
        if (event.world === 100) {
            return pick(this.vaults);
        }

        return BoringPersonality.onLevelEnter.call(this, event);
    }
});


var Bastion = extend(Personality, {
    type: "Bastion",

    bosses: [
        {rarity: 1, result: "The Kid reached the {boss}"},
        {rarity: 2, result: "A big old fella pops out in front of the kid"}
    ],

    healed: [
        {rarity: 1, result: "The kid healed up a bit"},
        {rarity: 1, result: "The kid found some health"},
        {rarity: 1, result: "Good, keep the health up, Kid"},
        {rarity: 1, result: "Now don't get hit again, Kid"},
        {rarity: 1, result: "The kid got some health back"}
    ],

    levelProgress: [
        {rarity: 1, result: "The kid finds another level"},
        {
            rarity: 1,
            result: "The kid wonders which one of these twisted streets to choose"
        },
        {
            rarity: 1,
            result: "Now he lands at the intersection between bad and wrong"
        },
        {rarity: 1, result: "Did anybody else survive?"},
        {rarity: 1, result: "The portal whisks him where he needs to go"},
        {rarity: 1, result: "The portal took the kid to yet another place"},
        {
            rarity: 1,
            result: "The kid starts to wonder if these portals ever stop"
        },
        {
            rarity: 1,
            result: "The ground forms up under his feet, as if pointing the way."
        },
        {rarity: 1, result: "He sets foot inside another {world} level"},
        {rarity: 1, result: "The kid arrives to the tough part of town"}
    ],

    weapons: [
        {rarity: 1, result: "Nice {weapon}, Kid"},
        {rarity: 1, result: "The kid finds {a} {weapon}"},
        {rarity: 1, result: "The kid fine-tunes that arsenal of his"},
        {rarity: 1, result: "Be careful with that {weapon}, Kid"},
        {
            rarity: 1,
            result: "Kid finds a memento from a girl he knew. Always used to fancy her."
        }
    ],

    hurt: append(BoringPersonality.hurt, [
        {rarity: 1, result: "Fella got a piece of the Kid"}
    ]),

    death: [
        {rarity: 1, result: "The Kid died to {a} {enemy}"},
        {rarity: 1, result: "Watch out Kid, those {enemy}s are dangerous"}
    ],

    getWeaponName: function (weaponId) {
        if (weaponId === 17) {
            return "Fang Repeater"
        }

        return Personality.getWeaponName.call(this, weaponId);
    },

    onWeaponPickup: function (event) {
        if (event.weaponId === 36) {
            return "Heavy-duty hammers such as these constructed Caelondia's famous Rippling Walls, and protected from elements and foes alike."
        }

        var name = this.getWeaponName(event.weaponId);

        return T(pick(this.weapons), {
            a: this.getPrefix(name),
            weapon: name
        });
    },

    onMutation: function (event) {
        var mutation = this.getMutationName(event.mutationId);
        return T("Then the Kid chose {mutation}", {
            mutation: mutation
        });
    },

    onUltraMutation: function (event) {
        var ultra = this.getUltraMutationName(event.characterId, event.ultra);
        return T("And finally the Kid chose {ultra}", {
            ultra: ultra
        });
    },

    onCrownChoice: function (event) {
        var crown = this.getCrownName(event.crownId);
        return T("Now The Kid sees something stranger still, a {crown}", {
            crown: crown
        });
    },

    onHurt: function (event) {
        var enemy = this.getEnemyName(event.enemyId);
        return T(pick(this.hurt), {
            a: this.getPrefix(enemy),
            enemy: enemy
        });
    },

    onDeath: function (event) {
        var enemy = this.getEnemyName(event.enemyId);
        return T(pick(this.death), {
            a: this.getPrefix(enemy),
            enemy: enemy
        });
    },

    onHealed: function (event) {
        return T(pick(this.healed), {
            amount: event.amount
        })
    },

    onLevelEnter: function (event) {
        var boss = this.getBossName(event.world, event.area, event.loop);
        var world = this.getWorldName(event.world);

        if (boss) {
            return T(pick(this.bosses), {
                boss: boss
            });
        } else if (event.world === 1 && event.area === 1 && event.loop === 0) {
            return "The Kid decided to have another try.";
        } else if (event.area === 1) {
            if (world) {
                return T("And the Kid entered the {world}", {
                    world: world
                });
            }
        } else {
            if (world) {
                return T(pick(this.levelProgress), {
                    world: world
                });
            }
        }
    }
});

var personalities = {
    "Boring": BoringPersonality,
    "SamuelLJackson": SamuelLJackson,
    "Bastion": Bastion
};