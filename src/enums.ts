export enum Plants {
    SUNFLOWER = {
        "name": "Sunflower",
        "recharge": 5000,
        "cost": 50,
        "damage": 25,
        "fireRate": [32000, 36000],
        "fireDirection": FireDirections.SPAWN,
        "spawnType": SpawnTypes.SUN
    },
    PEASHOOTER = {
        "name": "Peashooter",
        "recharge": 5000,
        "cost": 100,
        "damage": 20,
        "fireRate": [1350, 1500],
        "fireDirection": FireDirections.STRAIGHT,
        "fireType": FireTypes.PEA
    }
}

export enum FireDirections {
    STRAIGHT = "straight",
    LOBBED = "lobbed",
    SPAWN = "spawn"
}

export enum SpawnTypes {
    SUN = "sun",
    COINS = "coins"
}

export enum FireTypes {
    PEA = "pea",
}

export enum Zombies {
    BASIC = {
        "name": "zombie",
        "health": 190,
        "protection": false,
        "speed": ZombieSpeed.BASIC
    },
    CONE = {
        "name": "cone",
        "health": 190,
        "protection": true,
        "protectionType": ZombieArmor.CONE,
        "speed": ZombieSpeed.BASIC
    },
    BUCKET = {
        "name": "bucket",
        "health": 190,
        "protection": true,
        "protectionType": ZombieArmor.BUCKET,
        "speed": ZombieSpeed.BASIC
    },
}

export enum ZombieArmor {
    CONE = {
        "bonusHealth": 370
    },
    BUCKET = {
        "bonusHealth": 1100
    }
}

export enum ZombieSpeed {
    BASIC = 4700
}

export enum Boards {
    TUTORIAL1 = {name: "tutorial1",
    lanes: [
      {
        type: "dirt",
        number: 2,
      },
      {
        type: "grass",
        number: 1,
      },
      {
        type: "dirt",
        number: 2,
      },
    ],
    colors: [0, 0, 0, 0, 0],},
    TUTORIAL2 = {name: "tutorial2",
    lanes: [
      {
        type: "dirt",
        number: 1,
      },
      {
        type: "grass",
        number: 2,
      },
      {
        type: "dirt",
        number: 1,
      },
    ],
    colors: [0, 1, 0, 1, 0],},
    FRONTLAWN = {name: "frontLawn",
    lanes: [
      {
        type: "grass",
        number: 5,
      },
    ],
    colors: [0, 1, 0, 1, 0],}
}

export enum Lanes {
    GRASS = {
        name: "grass",
        colors: ["#154f1a", "#33b83e"],
      },
      DIRT = {
        name: "dirt",
        colors: ["#836539"],
      },
}