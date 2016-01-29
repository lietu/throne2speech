var WORLDS = {
    1: "Desert",
    2: "Sewers",
    3: "Scrap yard",
    4: "Caves",
    5: "Frozen city",
    6: "Labs",
    7: "Palace",
    100: "Crown Vault",
    101: "Oasis",
    102: "Pizza Sewers",
    103: "YV's Mansion",
    104: "Cursed Crystal Caves",
    105: "Jungle",
    107: "YV's Crib"
};

var ULTRAS = {
    1: {
        1: "Confiscate",
        2: "Gun Warrant"
    },
    2: {
        1: "Fortress",
        2: "Juggernaut"
    },
    3: {
        1: "Projectile Style",
        2: "Monster Style"
    },
    4: {
        1: "Brain Capacity",
        2: "Detachment"
    },
    5: {
        1: "Trapper",
        2: "Killer"
    },
    6: {
        1: "Ima Gun God",
        2: "Back 2 Bizniz"
    },
    7: {
        1: "Ambidextrous",
        2: "Get Loaded"
    },
    8: {
        1: "Refined Taste",
        2: "Regurgitate"
    },
    9: {
        1: "Harder to kill",
        2: "Determination"
    },
    10: {
        1: "Personal Guard",
        2: "Riot"
    },
    11: {
        1: "Stalker",
        2: "Anomaly",
        3: "Meltdown"
    },
    12: {
        1: "Super Portal Strike",
        2: "Super Blast Armor"
    }
};

/**
 * Names of all the items we want to show names for
 */
var NAMES = {
    characters: {
        0: "Random",
        1: "Fish",
        2: "Crystal",
        3: "Eyes",
        4: "Melting",
        5: "Plant",
        6: "Yung Venuz",
        7: "Steroids",
        8: "Robot",
        9: "Chicken",
        10: "Rebel",
        11: "Horror",
        12: "Rogue",
        13: "Big Dog",
        14: "Skeleton",
        15: "Frog",
        16: "Cuz"
    },
    causesOfDeath: {
        0: "Bandit",
        1: "Maggot",
        2: "Rad Maggot",
        3: "Big Maggot",
        4: "Scorpion",
        5: "Gold Scorpion",
        6: "Big Bandit",
        7: "Rat",
        8: "Rat King",
        9: "Green Rat",
        10: "Gator",
        11: "Ballguy",
        12: "Toxic Ballguy",
        13: "Ballguy Mama",
        14: "Assassin",
        15: "Raven",
        16: "Salamander",
        17: "Sniper",
        18: "Big Dog",
        19: "Spider",
        20: "New Cave Thing",
        21: "Laser Crystal",
        22: "Hyper Crystal",
        23: "Snow Bandit",
        24: "Snowbot",
        25: "Wolf",
        26: "Snowtank",
        27: "Lil Hunter",
        28: "Freak",
        29: "Explo Freak",
        30: "Rhino Freak",
        31: "Necromancer",
        32: "Turret",
        33: "Technomancer",
        34: "Guardian",
        35: "Explo Guardian",
        36: "Dog Guardian",
        37: "Throne",
        38: "Throne II",
        39: "Bone Fish",
        40: "Crab",
        41: "Turtle",
        42: "Venus Grunt",
        43: "Venus Sarge",
        44: "Fireballer",
        45: "Super Fireballer",
        46: "Jock",
        47: "Cursed Spider",
        48: "Cursed Crystal",
        49: "Mimic",
        50: "Health Mimic",
        51: "Grunt",
        52: "Inspector",
        53: "Shielder",
        54: "Crown Guardian",
        55: "Explosion",
        56: "Small Explosion",
        57: "Fire Trap",
        58: "Shield",
        59: "Toxin",
        60: "Horror",
        61: "Barrel",
        62: "Toxic Barrel",
        63: "Golden Barrel",
        64: "Car",
        65: "Venus Car",
        66: "Venus Car Fixed",
        67: "Venuz Car 2",
        68: "Icy Car",
        69: "Thrown Car",
        70: "Mine",
        71: "Crown of Death",
        72: "Rogue Strike",
        73: "Blood Launcher",
        74: "Blood Cannon",
        75: "Blood Hammer",
        76: "Disc",
        77: "Curse Eat",
        78: "Big Dog Missile",
        79: "Halloween Bandit",
        80: "Lil Hunter Death",
        81: "Throne Death",
        82: "Jungle Bandit",
        83: "Jungle Assassin",
        84: "Jungle Fly",
        85: "Crown of Hatred",
        86: "Ice Flower",
        87: "Cursed Ammo Pickup",
        88: "Underwater Lightning",
        89: "Elite Grunt",
        90: "Blood Gamble",
        91: "Elite Shielder",
        92: "Elite Inspector",
        93: "Captain",
        94: "Van",
        95: "Buff Gator",
        96: "Generator",
        97: "Lightning Crystal",
        98: "Golden Snowtank",
        99: "Green Explosion",
        100: "Small Generator",
        101: "Golden Disc",
        102: "Big Dog Explosion",
        103: "IDPD Freak",
        104: "Throne II Death",
        105: "Oasis Boss",
        "-1": "Nothing"
    },
    crownChoices: {
        1: "Bare Head",
        2: "Crown of Death",
        3: "Crown of Life",
        4: "Crown of Haste",
        5: "Crown of Guns",
        6: "Crown of Hatred",
        7: "Crown of Blood",
        8: "Crown of Destiny",
        9: "Crown of Love",
        10: "Crown of Risk",
        11: "Crown of Curses",
        12: "Crown of Luck",
        13: "Crown of Protection"
    },
    mutationChoices: {
        0: "Heavy Heart",
        1: "Rhino Skin",
        2: "Extra Feet",
        3: "Plutonium Hunger",
        4: "Rabbit Paw",
        5: "Throne Butt",
        6: "Lucky Shot",
        7: "Bloodlust",
        8: "Gamma Guts",
        9: "Second Stomach",
        10: "Back Muscle",
        11: "Scarier Face",
        12: "Euphoria",
        13: "Long Arms",
        14: "Boiling Veins",
        15: "Shotgun Shoulders",
        16: "Recycle Gland",
        17: "Laser Brain",
        18: "Last Wish",
        19: "Eagle Eyes",
        20: "Impact Wrists",
        21: "Bolt Marrow",
        22: "Stress",
        23: "Trigger Fingers",
        24: "Sharp Teeth",
        25: "Patience",
        26: "Hammer Head",
        27: "Strong Spirit",
        28: "Open Mind"
    },
    weaponChoices: {
        0: "Nothing",
        1: "Revolver",
        2: "Triple Machinegun",
        3: "Wrench",
        4: "Machinegun",
        5: "Shotgun",
        6: "Crossbow",
        7: "Grenade Launcher",
        8: "Double Shotgun",
        9: "Minigun",
        10: "Auto Shotgun",
        11: "Auto Crossbow",
        12: "Super Crossbow",
        13: "Shovel",
        14: "Bazooka",
        15: "Sticky Launcher",
        16: "SMG",
        17: "Assault Rifle",
        18: "Disc Gun",
        19: "Laser Pistol",
        20: "Laser Rifle",
        21: "Slugger",
        22: "Gatling Slugger",
        23: "Assault Slugger",
        24: "Energy Sword",
        25: "Super Slugger",
        26: "Hyper Rifle",
        27: "Screwdriver",
        28: "Laser Minigun",
        29: "Blood Launcher",
        30: "Splinter Gun",
        31: "Toxic Bow",
        32: "Sentry Gun",
        33: "Wave Gun",
        34: "Plasma Gun",
        35: "Plasma Cannon",
        36: "Energy Hammer",
        37: "Jackhammer",
        38: "Flak Cannon",
        39: "Golden Revolver",
        40: "Golden Wrench",
        41: "Golden Machinegun",
        42: "Golden Shotgun",
        43: "Golden Crossbow",
        44: "Golden Grenade Launcer",
        45: "Golden Laser Pistol",
        46: "Chicken Sword",
        47: "Nuke Launcher",
        48: "Ion Cannon",
        49: "Quadruple Machinegun",
        50: "Flamethrower",
        51: "Dragon",
        52: "Flare Gun",
        53: "Energy Screwdriver",
        54: "Hyper Launcher",
        55: "Laser Cannon",
        56: "Rusty Revolver",
        57: "Lightning Pistol",
        58: "Lightning Rifle",
        59: "Lightning Shotgun",
        60: "Super Flak Cannon",
        61: "Sawed-off Shotgun",
        62: "Splinter Pistol",
        63: "Super Splinter Gun",
        64: "Lighting SMG",
        65: "Smart Gun",
        66: "Heavy Crossbow",
        67: "Blood Hammer",
        68: "Lightning Cannon",
        69: "Pop Gun",
        70: "Plasma Rifle",
        71: "Pop Rifle",
        72: "Toxic Launcher",
        73: "Flame Cannon",
        74: "Lightning Hammer",
        75: "Flame Shotgun",
        76: "Double Flame Shotgun",
        77: "Auto Flame Shotgun",
        78: "Cluster Launcher",
        79: "Grenade Shotgun",
        80: "Grenade Rifle",
        81: "Rogue Rifle",
        82: "Party Gun",
        83: "Double Minigun",
        84: "Gatling Bazooka",
        85: "Auto Grenade Shotgun",
        86: "Ultra Revolver",
        87: "Ultra Laser Pistol",
        88: "Sledgehammer",
        89: "Heavy Revolver",
        90: "Heavy Machinegun",
        91: "Heavy Slugger",
        92: "Ultra Shovel",
        93: "Ultra Shotgun",
        94: "Ultra Crossbow",
        95: "Ultra Grenade Launcher",
        96: "Plasma Minigun",
        97: "Devastator",
        98: "Golden Plasma Gun",
        99: "Golden Slugger",
        100: "Golden Splinter Gun",
        101: "Golden Screwdriver",
        102: "Golden Bazooka",
        103: "Golden Assault Rifle",
        104: "Super Disc Gun",
        105: "Heavy Auto Crossbow",
        106: "Heavy Assault Rifle",
        107: "Blood Cannon",
        108: "Dog Spin Attack",
        109: "Dog Missile",
        110: "Incinerator",
        111: "Super Plasma Cannon",
        112: "Seeker Pistol",
        113: "Seeker Shotgun",
        114: "Eraser",
        115: "Guitar",
        116: "Bouncer SMG",
        117: "Bouncer Shotgun",
        118: "Hyper Slugger",
        119: "Super Bazooka",
        120: "Frog Pistol",
        121: "Black Sword",
        122: "Golden Nuke Launcher",
        123: "Golden Disc Gun",
        124: "Heavy Grenade Launcher",
        125: "Gun Gun",
        201: "Golden Frog Pistol"
    }
};