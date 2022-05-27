export var Plants;
(function(Plants2) {
  Plants2[Plants2["SUNFLOWER"] = 0] = "SUNFLOWER";
  Plants2[Plants2["PEASHOOTER"] = 1] = "PEASHOOTER";
  Plants2[Plants2["BONKCHOY"] = 2] = "BONKCHOY";
})(Plants || (Plants = {}));
export var PacketPortraitPaths;
(function(PacketPortraitPaths2) {
  PacketPortraitPaths2["BG"] = "images/seedpackets/seedpacket.png";
  PacketPortraitPaths2["SUNFLOWER"] = "images/seedpackets/portraits/sunflower.png";
  PacketPortraitPaths2["PEASHOOTER"] = "images/seedpackets/portraits/peashooter.png";
  PacketPortraitPaths2["BONKCHOY"] = "images/seedpackets/portraits/bonkchoy.png";
})(PacketPortraitPaths || (PacketPortraitPaths = {}));
export const PlantAnimFrameCounts = [1, 1];
export const PlantIdleFrameOrder = [[0], [0]];
export const PlantSpriteSizeRatio = [250 / 284, 250 / 247];
export const PlantSunCost = [50, 100];
export const PlantRechargeTime = [300, 300];
export var PlantHealth;
(function(PlantHealth2) {
  PlantHealth2[PlantHealth2["SUNFLOWER"] = 300] = "SUNFLOWER";
  PlantHealth2[PlantHealth2["PEASHOOTER"] = 300] = "PEASHOOTER";
})(PlantHealth || (PlantHealth = {}));
export const PlantAnimPaths = [
  "images/plants/sunflower/",
  "images/plants/peashooter/"
];
