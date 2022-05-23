export var Plants;
(function(Plants2) {
  Plants2[Plants2["SUNFLOWER"] = {
    name: "Sunflower",
    recharge: 5e3,
    cost: 50,
    damage: 25,
    fireRate: [32e3, 36e3],
    fireDirection: FireDirections.SPAWN,
    spawnType: SpawnTypes.SUN
  }] = "SUNFLOWER";
  Plants2[Plants2["PEASHOOTER"] = {
    name: "Peashooter",
    recharge: 5e3,
    cost: 100,
    damage: 20,
    fireRate: [1350, 1500],
    fireDirection: FireDirections.STRAIGHT,
    fireType: FireTypes.PEA
  }] = "PEASHOOTER";
})(Plants || (Plants = {}));
export var FireDirections;
(function(FireDirections2) {
  FireDirections2["STRAIGHT"] = "straight";
  FireDirections2["LOBBED"] = "lobbed";
  FireDirections2["SPAWN"] = "spawn";
})(FireDirections || (FireDirections = {}));
export var SpawnTypes;
(function(SpawnTypes2) {
  SpawnTypes2["SUN"] = "sun";
  SpawnTypes2["COINS"] = "coins";
})(SpawnTypes || (SpawnTypes = {}));
export var FireTypes;
(function(FireTypes2) {
  FireTypes2["PEA"] = "pea";
})(FireTypes || (FireTypes = {}));
export var Zombies;
(function(Zombies2) {
  Zombies2[Zombies2["BASIC"] = {
    name: "zombie",
    health: 190,
    protection: false,
    speed: ZombieSpeed.BASIC
  }] = "BASIC";
  Zombies2[Zombies2["CONE"] = {
    name: "cone",
    health: 190,
    protection: true,
    protectionType: ZombieArmor.CONE,
    speed: ZombieSpeed.BASIC
  }] = "CONE";
  Zombies2[Zombies2["BUCKET"] = {
    name: "bucket",
    health: 190,
    protection: true,
    protectionType: ZombieArmor.BUCKET,
    speed: ZombieSpeed.BASIC
  }] = "BUCKET";
})(Zombies || (Zombies = {}));
export var ZombieArmor;
(function(ZombieArmor2) {
  ZombieArmor2[ZombieArmor2["CONE"] = {
    bonusHealth: 370
  }] = "CONE";
  ZombieArmor2[ZombieArmor2["BUCKET"] = {
    bonusHealth: 1100
  }] = "BUCKET";
})(ZombieArmor || (ZombieArmor = {}));
export var ZombieSpeed;
(function(ZombieSpeed2) {
  ZombieSpeed2[ZombieSpeed2["BASIC"] = 4700] = "BASIC";
})(ZombieSpeed || (ZombieSpeed = {}));
export var Boards;
(function(Boards2) {
  Boards2[Boards2["TUTORIAL1"] = {
    name: "tutorial1",
    lanes: [
      {
        type: "dirt",
        number: 2
      },
      {
        type: "grass",
        number: 1
      },
      {
        type: "dirt",
        number: 2
      }
    ],
    colors: [0, 0, 0, 0, 0]
  }] = "TUTORIAL1";
  Boards2[Boards2["TUTORIAL2"] = {
    name: "tutorial2",
    lanes: [
      {
        type: "dirt",
        number: 1
      },
      {
        type: "grass",
        number: 2
      },
      {
        type: "dirt",
        number: 1
      }
    ],
    colors: [0, 1, 0, 1, 0]
  }] = "TUTORIAL2";
  Boards2[Boards2["FRONTLAWN"] = {
    name: "frontLawn",
    lanes: [
      {
        type: "grass",
        number: 5
      }
    ],
    colors: [0, 1, 0, 1, 0]
  }] = "FRONTLAWN";
})(Boards || (Boards = {}));
export var Lanes;
(function(Lanes2) {
  Lanes2[Lanes2["GRASS"] = {
    name: "grass",
    colors: ["#154f1a", "#33b83e"]
  }] = "GRASS";
  Lanes2[Lanes2["DIRT"] = {
    name: "dirt",
    colors: ["#836539"]
  }] = "DIRT";
})(Lanes || (Lanes = {}));
