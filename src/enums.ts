export enum Plants {
  SUNFLOWER = 0,
  PEASHOOTER = 1,
  BONKCHOY = 2,
}

export enum PacketPortraitPaths {
  BG = "images/seedpackets/seedpacket.png",
  SUNFLOWER = "images/seedpackets/portraits/sunflower.png",
  PEASHOOTER = "images/seedpackets/portraits/peashooter.png",
  BONKCHOY = "images/seedpackets/portraits/bonkchoy.png",
}

export const PlantAnimFrameCounts = [1, 1];

export const PlantIdleFrameOrder = [[0], [0]];

export const PlantSpriteSizeRatio = [250 / 284, 250 / 247];

export const PlantSunCost = [50, 100];

export const PlantRechargeTime = [300, 300];

export enum PlantHealth {
  SUNFLOWER = 300,
  PEASHOOTER = 300,
}

export const PlantAnimPaths = [
  "images/plants/sunflower/",
  "images/plants/peashooter/",
];

export const ProjectileSprites = [
  "images/projectiles/pea.png",
  "images/projectiles/cabbage.png",
  "images/projectiles/kernel.png",
  "images/projectiles/melon.png"
]
