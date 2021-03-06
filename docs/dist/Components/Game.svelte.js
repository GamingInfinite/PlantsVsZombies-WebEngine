import './Game.svelte.css.proxy.js';
/* src/Components/Game.svelte generated by Svelte v3.48.0 */
import {
	SvelteComponent,
	attr,
	detach,
	element,
	init,
	insert,
	noop,
	safe_not_equal
} from "../../snowpack/pkg/svelte/internal.js";

import { onMount } from "../../snowpack/pkg/svelte.js";

import {
	Plants,
	PlantAnimFrameCounts,
	PacketPortraitPaths,
	PlantAnimPaths,
	PlantIdleFrameOrder,
	PlantSpriteSizeRatio,
	PlantSunCost,
	PlantRechargeTime,
	PlantHealth,
	ProjectileSprites
} from "../enums.js";

function create_fragment(ctx) {
	let div;

	return {
		c() {
			div = element("div");
			div.innerHTML = `<canvas id="game" width="1920" height="1080" class="svelte-1fyqfil"></canvas>`;
			attr(div, "id", "gameWrapper");
		},
		m(target, anchor) {
			insert(target, div, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div);
		}
	};
}

var FPS = 60;

function drawRotated(ctx, degrees, img, x, y, width, height) {
	ctx.save();
	let radians = degrees * Math.PI / 180;
	let xtranslate = x + width / 2;
	let ytranslate = y + height / 2;
	ctx.translate(xtranslate, ytranslate);
	ctx.rotate(radians);
	ctx.translate(-xtranslate, -ytranslate);
	ctx.drawImage(img, x, y, width, height);
	ctx.restore();
}

function sunHitTest(x, y, sunx, suny, width, height) {
	return x >= sunx && x <= sunx + width && y > suny && y <= suny + height;
}

function instance($$self, $$props, $$invalidate) {
	let { boardType } = $$props;
	let { allowPick = false } = $$props;
	let { maxPlants = 10 } = $$props;
	let { setPicks = [Plants.SUNFLOWER, Plants.PEASHOOTER] } = $$props;
	let { sunCount = 50 } = $$props;
	let rechargeTime = [];
	let sunFall = [0, 600];
	var boardInUse;
	var isFullscreen = false;
	var boardXOffset;
	var boardYOffset;
	var laneHeight;
	var laneWidth;
	var tileWidth;
	var packetsXOffset;
	var packetSeperation;
	var packetsYOffset;
	var packetHeight;
	var packetWidth;
	let sunWH;
	let sunIconXOffset;
	let sunIconYOffset;
	let sunBgXOffset;
	let sunBgYOffset;
	let sunBgWidth;
	let sunBgHeight;
	let sunCountXOffset;
	let sunCountYOffset;

	let boards = [
		{
			name: "frontLawn",
			lanes: [{ type: "grass", number: 5 }],
			colors: [0, 1, 0, 1, 0]
		},
		{
			name: "tutorial1",
			lanes: [
				{ type: "dirt", number: 2 },
				{ type: "grass", number: 1 },
				{ type: "dirt", number: 2 }
			],
			colors: [0, 0, 0, 0, 0]
		}
	];

	let types = [
		{
			name: "grass",
			colors: ["#154f1a", "#33b83e"]
		},
		{ name: "dirt", colors: ["#836539"] }
	];

	let selectedSeed = -1;
	let shovelSelect = false;
	let selectedX;
	let selectedY;
	var lanes = [];
	var loadedPorts = [];
	var resourceImages = [];
	var extraIcons = [];
	var projectiles = [];

	var seedPortaits = [
		PacketPortraitPaths.SUNFLOWER,
		PacketPortraitPaths.PEASHOOTER,
		PacketPortraitPaths.BONKCHOY
	];

	var plantAnims = [];

	function loadImages() {
		var packetBG = new Image();
		var sunIcon = new Image();
		var shovelIcon = new Image();
		packetBG.src = PacketPortraitPaths.BG;
		sunIcon.src = "images/resources/sun/sun.png";
		shovelIcon.src = "images/shovel.png";
		resourceImages.push(sunIcon);
		loadedPorts.push(packetBG);
		extraIcons.push(shovelIcon);

		for (let i = 0; i < maxPlants; i++) {
			if (typeof setPicks[i] == "undefined") {
				$$invalidate(0, setPicks[i] = 0, setPicks);
			}

			let plantPort = new Image();
			plantPort.src = seedPortaits[setPicks[i]];
			loadedPorts.push(plantPort);
			let plantIdle = [];

			for (let j = 0; j < PlantAnimFrameCounts[i]; j++) {
				let plantFrame = new Image();
				plantFrame.src = PlantAnimPaths[i] + j + ".png";

				if (PlantIdleFrameOrder[i].includes(j)) {
					plantIdle.push(plantFrame);
				}
			}

			plantAnims.push(plantIdle);
		}

		for (let i = 0; i < ProjectileSprites.length; i++) {
			const element = ProjectileSprites[i];
			let proj = new Image();
			proj.src = element;
			projectiles.push(proj);
		}
	}

	CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
		if (width < 2 * radius) radius = width / 2;
		if (height < 2 * radius) radius = height / 2;
		this.beginPath();
		this.moveTo(x + radius, y);
		this.arcTo(x + width, y, x + width, y + height, radius);
		this.arcTo(x + width, y + height, x, y + height, radius);
		this.arcTo(x, y + height, x, y, radius);
		this.arcTo(x, y, x + width, y, radius);
		this.closePath();
		return this;
	};

	//Gets the json file from the boards array
	function getBoardJson(boardKey) {
		for (let i = 0; i < boards.length; i++) {
			const element = boards[i];

			if (element.name == boardKey) {
				boardInUse = element;
			}
		}
	}

	//Fills the lanes array
	function parseLanes() {
		for (let i = 0; i < boardInUse.lanes.length; i++) {
			const element = boardInUse.lanes[i];

			for (let j = 0; j < element.number; j++) {
				lanes.push(element.type);
			}
		}
	}

	//Used for drawDebugBoard()
	function getLaneJson(laneKey) {
		for (let i = 0; i < types.length; i++) {
			const element = types[i];

			if (element.name == laneKey) {
				return element;
			}
		}
	}

	function getPacketRecharge() {
		for (let i = 0; i < maxPlants; i++) {
			let rechargePair = [0, PlantRechargeTime[setPicks[i]]];

			switch (setPicks[i]) {
				case 0:
					rechargePair[0] = PlantRechargeTime[setPicks[i]];
					break;
				default:
					break;
			}

			rechargeTime.push(rechargePair);
		}
	}

	//Drawing the Debug Lawn
	function drawDebugBoard(ctx) {
		for (let i = 0; i < lanes.length; i++) {
			const element = lanes[i];

			if (getLaneJson(element).colors.length > 1) {
				for (let j = 0; j < 9; j++) {
					let altColor;

					if (boardInUse.colors[i] == 0) {
						altColor = 1;
					} else {
						altColor = 0;
					}

					if (j % 2 == 0) {
						ctx.fillStyle = getLaneJson(element).colors[boardInUse.colors[i]];
					} else {
						ctx.fillStyle = getLaneJson(element).colors[altColor];
					}

					ctx.fillRect(boardXOffset + j * tileWidth, i * laneHeight + boardYOffset, tileWidth, laneHeight + 1);
				}
			} else {
				ctx.fillStyle = getLaneJson(element).colors[boardInUse.colors[i]];
				ctx.fillRect(boardXOffset, i * laneHeight + boardYOffset, laneWidth, laneHeight + 1);
			}
		}
	}

	//Drawing Seed Packets
	function drawSeedPackets(ctx) {
		for (let i = 0; i < maxPlants; i++) {
			if (selectedSeed == setPicks[i]) {
				ctx.globalAlpha = 0.5;
				drawPacket(ctx, i);
				ctx.globalAlpha = 1;
				drawPacketAtCursor(ctx, i);
			} else {
				drawPacket(ctx, i);
				let plantId = setPicks[i];

				if (PlantSunCost[plantId] > sunCount || rechargeTime[i][0] < rechargeTime[i][1]) {
					ctx.fillStyle = "#000";
					ctx.globalAlpha = 0.25;
					ctx.roundRect(packetsXOffset + (packetWidth + packetSeperation) * i, packetsYOffset, packetWidth, packetHeight, 8);
					ctx.fill();
					ctx.globalAlpha = 1;
				}

				if (rechargeTime[i][0] < rechargeTime[i][1]) {
					let heightFraction = 1 - rechargeTime[i][0] / rechargeTime[i][1];
					ctx.fillStyle = "#000";
					ctx.globalAlpha = 0.25;
					ctx.roundRect(packetsXOffset + (packetWidth + packetSeperation) * i, packetsYOffset, packetWidth, packetHeight * heightFraction, 8);
					ctx.fill();
					ctx.globalAlpha = 1;
				}
			}
		}
	}

	function drawPacket(ctx, i) {
		//Draw BG
		ctx.drawImage(loadedPorts[0], packetsXOffset + (packetWidth + packetSeperation) * i, packetsYOffset, packetWidth, packetHeight);

		//Draw Portrait
		ctx.drawImage(loadedPorts[i + 1], packetsXOffset + (packetWidth + packetSeperation) * i, packetsYOffset, packetWidth, packetHeight);
	}

	function drawPacketAtCursor(ctx, i) {
		//Draw BG
		ctx.drawImage(loadedPorts[0], selectedX - packetWidth / 2, selectedY - packetHeight / 2, packetWidth, packetHeight);

		//Draw Portrait
		ctx.drawImage(loadedPorts[i + 1], selectedX - packetWidth / 2, selectedY - packetHeight / 2, packetWidth, packetHeight);
	}

	var plantsToBeDrawn = [];
	var sunToBeDrawn = [];
	var projectilesTBD = [];

	//Drawing Plants | Add support for animations later !!IMPORTANT!!
	function drawPlants(ctx) {
		for (let i = 0; i < plantsToBeDrawn.length; i++) {
			const element = plantsToBeDrawn[i];
			let firstFrame = plantAnims[element.plant][0];
			let tileX = element.tile[0];
			let tileY = element.tile[1];
			let plantXOffset = tileWidth * 0.5 - laneHeight * 0.9 * PlantSpriteSizeRatio[element.plant] / 2;
			let plantYOffset = laneHeight * 0.06;

			//Add support for animations later !!IMPORTANT!!
			ctx.drawImage(firstFrame, boardXOffset + tileX * tileWidth + plantXOffset, tileY * laneHeight + boardYOffset + plantYOffset, laneHeight * 0.9 * PlantSpriteSizeRatio[element.plant], laneHeight * 0.9);
		}
	}

	//Draw Falling and Produced Sun
	function drawSunObjects(ctx) {
		for (let i = 0; i < sunToBeDrawn.length; i++) {
			const element = sunToBeDrawn[i];
			let img = resourceImages[0];
			let sunPositionX = element.posX;
			let sunPositionY = element.posY;
			let sunWidth = element.width;
			let sunHeight = element.height;
			ctx.globalAlpha = 1 - element.lifetime[0] / element.lifetime[1];
			ctx.drawImage(img, sunPositionX, sunPositionY, sunWidth, sunHeight);
		}
	}

	//Draw Projectiles From Plants
	function drawProjectiles(ctx) {
		for (let i = 0; i < projectilesTBD.length; i++) {
			const element = projectilesTBD[i];
			let type = element.type;
			let projX = element.posX;
			let projY = element.posY;
			let width = element.width;
			let height = element.height;
			let rotation = element.rotation;
			drawRotated(ctx, rotation, projectiles[type], projX, projY, width, height);
		}
	}

	//Drawing Sun Hud
	function drawSunCount(ctx) {
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = "#000";
		ctx.roundRect(sunBgXOffset, sunBgYOffset, sunBgWidth, sunBgHeight, 8);
		ctx.fill();
		ctx.globalAlpha = 1;
		ctx.font = "40px CafeteriaBlack";
		ctx.fillStyle = "#FFF";
		ctx.fillText(sunCount, sunCountXOffset, sunCountYOffset);
		ctx.fillStyle = "#000";
		ctx.strokeText(sunCount, sunCountXOffset, sunCountYOffset);
		ctx.drawImage(resourceImages[0], sunIconXOffset, sunIconYOffset, sunWH, sunWH);
	}

	//Draw Shovel
	function drawShovel(ctx, width) {
		var shovelXOffset = packetsXOffset + (packetWidth + packetSeperation) * maxPlants;
		var shovelYOffset = packetsYOffset + packetHeight / 8;

		if (!shovelSelect) {
			ctx.drawImage(extraIcons[0], shovelXOffset, shovelYOffset, width * 0.04, width * 0.04);
		} else {
			ctx.globalAlpha = 0.5;
			ctx.drawImage(extraIcons[0], shovelXOffset, shovelYOffset, width * 0.04, width * 0.04);
			ctx.globalAlpha = 1;
			ctx.drawImage(extraIcons[0], selectedX - width * 0.04 / 2, selectedY - width * 0.04 / 2, width * 0.04, width * 0.04);
		}
	}

	getBoardJson(boardType);
	parseLanes();
	loadImages();
	getPacketRecharge();

	function update() {
		sunWH = window.innerHeight * 0.12;
		sunIconXOffset = window.innerWidth * 0.005;
		sunIconYOffset = window.innerHeight * 0.03;
		sunBgXOffset = sunIconXOffset + sunWH / 1.5;
		sunBgYOffset = sunIconYOffset + sunWH / 4;
		sunBgWidth = sunWH;
		sunBgHeight = sunWH / 2;
		sunCountXOffset = sunIconXOffset + sunBgXOffset * 1.3;
		sunCountYOffset = sunIconYOffset + sunBgYOffset * 1.25;
		boardXOffset = window.innerWidth * 0.15;
		boardYOffset = window.innerHeight * 0.2;
		packetsXOffset = sunBgXOffset + sunBgWidth + window.innerWidth * 0.01;
		packetSeperation = window.innerWidth * 0.005;
		packetsYOffset = sunBgYOffset - sunBgHeight / 6;
		laneHeight = (window.innerHeight - window.innerHeight * 0.3) / 5;
		laneWidth = window.innerWidth * 0.8;
		let packetRatio = 348 / 216;
		packetHeight = laneHeight * 0.6;
		packetWidth = packetHeight * packetRatio;
		tileWidth = laneWidth / 9;

		for (let i = 0; i < maxPlants; i++) {
			if (rechargeTime[i][0] < rechargeTime[i][1]) {
				rechargeTime[i][0] += 1;
			}
		}

		if (sunFall[0] == sunFall[1]) {
			let newSun = {
				posX: Math.floor(Math.random() * laneWidth) + boardXOffset - sunWH,
				posY: -sunWH,
				width: sunWH,
				height: sunWH,
				lowestY: boardYOffset + laneHeight * 4 - sunWH,
				lifetime: [0, 420],
				collected: false,
				value: 25
			};

			sunToBeDrawn.push(newSun);
			sunFall[0] = 0;
		} else {
			sunFall[0] += 1;
		}

		for (let i = 0; i < sunToBeDrawn.length; i++) {
			const element = sunToBeDrawn[i];

			if (element.posY < element.lowestY && !element.collected) {
				element.posY += 1.5;
			}

			if (element.collected) {
				if (element.posX > window.innerWidth * 0.003) {
					element.posX -= 1 * (element.posX / (window.innerWidth * 0.003));
				}

				if (element.posY < window.innerHeight * 0.025) {
					element.posY += 2;
				} else if (element.posY > window.innerHeight * 0.025) {
					element.posY -= 2 * (element.posY / (window.innerHeight * 0.025));
				}

				let ybool = element.posY < window.innerHeight * 0.025;

				if (element.posX < window.innerWidth * 0.003 && ybool) {
					sunToBeDrawn.splice(i, 1);
				}
			}

			if (element.lifetime[0] < element.lifetime[1] && !(element.posY < element.lowestY)) {
				element.lifetime[0] += 1;
			} else if (element.lifetime[1] == -1) {
				
			} else if (element.lifetime[0] == element.lifetime[1]) {
				sunToBeDrawn.splice(i, 1);
			}
		}

		for (let i = 0; i < projectilesTBD.length; i++) {
			const element = projectilesTBD[i];
			element.posX += element.velocity;

			if (element.type == 0) {
				let tileStartY = element.tile[1] * laneHeight + boardYOffset;
				let projYOffset = laneHeight * 0.2;
				let projWH = laneHeight * 0.3;
				element.posY = tileStartY + projYOffset;
				element.width = projWH;
				element.height = projWH;
			}

			if (element.posX > window.innerWidth) {
				projectilesTBD.splice(i, 1);
			}
		}
	}

	function draw() {
		//Frame Draw Preparation
		var canvas = document.getElementById("game");

		var ctx = canvas.getContext("2d");
		let height = window.innerHeight;
		let width = window.innerWidth;
		canvas.height = height;
		canvas.width = width;
		ctx.globalAlpha = 1;

		//Debug Lawn
		drawDebugBoard(ctx);

		//Lawn Art/Image
		//idk put an actual function here later when you get to it
		//Draw Plants
		drawPlants(ctx);

		//Draw Zombies
		//put function here
		//Draw Foreground
		//put function here
		//Draw HUD (Seeds, Shovel, Sun Count, etc.)
		drawSeedPackets(ctx);

		drawSunCount(ctx);
		drawShovel(ctx, width);

		//Draw Projectiles (Sun, Peas, Darts, What have you)
		drawSunObjects(ctx);

		drawProjectiles(ctx);
	}

	onMount(() => {
		let eventGame = document.getElementById("game");

		eventGame.onmousedown = function (e) {
			right_click_exit: {
				if (e.button == 2) {
					shovelSelect = false;
					selectedSeed = -1;
					break right_click_exit;
				}

				if (selectedSeed == -1 && !shovelSelect) {
					//Sun Collection Code
					sun_collected: {
						for (let i = 0; i < sunToBeDrawn.length; i++) {
							const element = sunToBeDrawn[i];

							if (sunHitTest(e.clientX, e.clientY, element.posX, element.posY, element.width, element.height) && !element.collected) {
								element.collected = true;
								$$invalidate(1, sunCount = parseInt(sunCount) + element.value);
								let Points = new Audio("audio/points.ogg");
								Points.preservesPitch = false;
								Points.playbackRate = 1 + Math.floor(Math.random() * 30) / 100;
								Points.play();
								break sun_collected;
							}
						}
					}
				} else {
					action_completed: {
						for (let i = 0; i < lanes.length; i++) {
							for (let j = 0; j < 9; j++) {
								if (lanes[i] == "dirt") {
									break;
								}

								if (tileHitTest(e.clientX, e.clientY, i, j)) {
									if (selectedSeed != -1) {
										for (let k = 0; k < plantsToBeDrawn.length; k++) {
											const element = plantsToBeDrawn[k];

											if (element.tile[0] == j && element.tile[1] == i) {
												break right_click_exit;
											}
										}

										let audio = new Audio("audio/plant1.ogg");
										audio.play();
										let selectedPlantString = Object.keys(Plants)[selectedSeed];
										let drawObject = { plant: selectedPlantString, tile: [j, i] };
										$$invalidate(1, sunCount -= PlantSunCost[selectedSeed]);
										rechargeTime[setPicks[selectedSeed]][0] = 0;
										plantsToBeDrawn.push(drawObject);
										plantFunctions[selectedSeed](j, i);
										break action_completed;
									} else if (shovelSelect) {
										for (let k = 0; k < plantHooks.length; k++) {
											plantisdead: {
												const element = plantHooks[k];

												if (element.isDead) {
													break plantisdead;
												}

												let tileX = element.coords[0];
												let tileY = element.coords[1];
												let id = element.id;

												if (tileX == j && tileY == i) {
													let audio = new Audio("audio/plant0.ogg");
													audio.play();
													plantHealthControl[id] = 0;

													for (let l = 0; l < plantsToBeDrawn.length; l++) {
														const element = plantsToBeDrawn[l];

														if (element.tile[0] == j && element.tile[1] == i) {
															plantsToBeDrawn.splice(l, 1);
														}
													}

													element.isDead = !element.isDead;
													shovelSelect = false;
													break action_completed;
												}
											}
										}
									}
								}
							}
						}
					}
				}

				selectedX = e.clientX;
				selectedY = e.clientY;
			}
		};

		eventGame.onmouseup = function (e) {
			if (selectedSeed == -1 && !shovelSelect) {
				for (let i = 0; i < maxPlants; i++) {
					noresponse: {
						if (PlantSunCost[setPicks[i]] > sunCount) {
							break noresponse;
						}

						if (rechargeTime[i][0] < rechargeTime[i][1]) {
							break noresponse;
						}

						if (seedPacketHitTest(e.clientX, e.clientY, i)) {
							selectedSeed = setPicks[i];
							let seedLift = new Audio("audio/seedlift.ogg");
							seedLift.play();
						}
					}
				}
			} else {
				selectedSeed = -1;
			}

			//Shovel Pickup
			if (shovelHitTest(e.clientX, e.clientY, window.innerWidth, window.innerHeight) && selectedSeed == -1 && !shovelSelect) {
				let shovelAudio = new Audio("audio/shovel.ogg");
				shovelAudio.play();
				shovelSelect = true;
			}
		};

		eventGame.onmousemove = function (e) {
			selectedX = e.clientX;
			selectedY = e.clientY;
		};

		document.onkeydown = function (e) {
			if (e.code.toLowerCase() == "keyr") {
				if (selectedSeed == -1 && shovelSelect == false) {
					document.exitFullscreen();
				}

				shovelSelect = false;
				selectedSeed = -1;
			}

			if (e.code.toLowerCase() == "keyf") {
				//Make this remapable later
				let elemFull = document.getElementById("gameWrapper");

				elemFull.requestFullscreen();
				isFullscreen = true;
			}

			if (e.code.toLowerCase() == "keys") {
				//Remapable keys later
				shovelSelect = !shovelSelect;
			}

			let digitKeys = [
				"digit1",
				"digit2",
				"digit3",
				"digit4",
				"digit5",
				"digit6",
				"digit7",
				"digit8",
				"digit9",
				"digit0"
			];

			for (let i = 0; i < digitKeys.length; i++) {
				noresponse: {
					if (e.code.toLowerCase() == digitKeys[i]) {
						if (PlantSunCost[setPicks[i]] > sunCount) {
							break noresponse;
						}

						if (rechargeTime[i][0] < rechargeTime[i][1]) {
							break noresponse;
						}

						selectedSeed = setPicks[i];
						let seedLift = new Audio("audio/seedlift.ogg");
						seedLift.play();
					}
				}
			}
		};
	});

	function seedPacketHitTest(x, y, i) {
		let packetStartX = packetsXOffset + (packetWidth + packetSeperation) * i;
		let packetStartY = packetsYOffset;
		return x >= packetStartX && x <= packetStartX + packetWidth && y >= packetStartY && y <= packetStartY + packetHeight;
	}

	function tileHitTest(x, y, i, j) {
		let packetStartX = boardXOffset + j * tileWidth;
		let packetStartY = i * laneHeight + boardYOffset;
		let packetWidth = tileWidth;
		let packetHeight = laneHeight + 1;
		return x >= packetStartX && x <= packetStartX + packetWidth && y >= packetStartY && y <= packetStartY + packetHeight;
	}

	function shovelHitTest(x, y, width, height) {
		let shovelStartX = packetsXOffset + (packetWidth + packetSeperation) * maxPlants;
		let shovelStartY = height * 0.05;
		return x >= shovelStartX && x <= shovelStartX + width * 0.04 && y >= shovelStartY && y <= shovelStartY + width * 0.04;
	}

	setInterval(
		() => {
			update();
			draw();
		},
		1000 / FPS
	);

	//PLANT LOOPS.  I literally am going to go insane.  I need to debug these each INDIVIDUALLY.  Like some are similar but this is going to be hell.
	const plantFunctions = [sunflower, peashooter];

	var plants = [];
	var plantHooks = [];
	var plantHealthControl = [];
	var plantActionTimers = [];

	function sunflower(tileX, tileY) {
		plantHooks.push({
			coords: [tileX, tileY],
			id: plants.length,
			type: Plants.SUNFLOWER,
			isDead: false
		});

		plants.push(setInterval(sunflowerCallback, 1000 / FPS, tileX, tileY, plants.length));
		plantHealthControl.push(PlantHealth.SUNFLOWER);
		plantActionTimers.push([0, Math.floor(Math.random() * 240) + 1920]);
	} // plantActionTimers.push([0, 60]);

	function sunflowerCallback(tileX, tileY, id) {
		let tileStartX = boardXOffset + tileX * tileWidth;
		let tileStartY = tileY * laneHeight + boardYOffset;
		let plantXOffset = tileWidth * 0.5 - laneHeight * 0.9 * PlantSpriteSizeRatio[plantHooks[id].type] / 2;
		let plantYOffset = laneHeight * 0.06;

		if (plantHealthControl[id] == 0) {
			clearInterval(plants[id]);
		} else if (plantActionTimers[id][0] >= plantActionTimers[id][1]) {
			sunToBeDrawn.push({
				posX: tileStartX + plantXOffset,
				posY: tileStartY + plantYOffset,
				width: sunWH,
				height: sunWH,
				lowestY: tileStartY + laneHeight - sunWH,
				lifetime: [0, 480],
				collected: false,
				value: 25
			});

			plantActionTimers[id][0] = 0;
			plantActionTimers[id][1] = Math.floor(Math.random() * 240) + 1920;
		} else if (plantActionTimers[id][0] < plantActionTimers[id][1]) {
			plantActionTimers[id][0] += 1; // plantActionTimers[id][1] = 60;
		}
	}

	function peashooter(tileX, tileY) {
		plantHooks.push({
			coords: [tileX, tileY],
			id: plants.length,
			type: Plants.PEASHOOTER,
			isDead: false
		});

		plants.push(setInterval(peashooterCallback, 1000 / FPS, tileX, tileY, plants.length));
		plantHealthControl.push(PlantHealth.PEASHOOTER);
		plantActionTimers.push([0, Math.floor(Math.random() * 9) + 81]);
	}

	function peashooterCallback(tileX, tileY, id) {
		let tileStartX = boardXOffset + tileX * tileWidth;
		let tileStartY = tileY * laneHeight + boardYOffset;
		let projXOffset = tileWidth * 0.66;
		let projYOffset = laneHeight * 0.2;
		let projWH = laneHeight * 0.3;

		if (plantHealthControl[id] == 0) {
			clearInterval(plants[id]);
		} else if (plantActionTimers[id][0] >= plantActionTimers[id][1]) {
			//Projectile Code Here
			projectilesTBD.push({
				type: 0,
				tile: [tileX, tileY],
				posX: tileStartX + projXOffset,
				posY: tileStartY + projYOffset,
				width: projWH,
				height: projWH,
				velocity: 13,
				arcOffset: 0,
				rotation: 0,
				rotationSpeed: 0,
				damage: 20
			});

			plantActionTimers[id][0] = 0;
			plantActionTimers[id][1] = Math.floor(Math.random() * 9) + 81;
		} else if (plantActionTimers[id][0] < plantActionTimers[id][1]) {
			plantActionTimers[id][0] += 1;
		}
	}

	$$self.$$set = $$props => {
		if ('boardType' in $$props) $$invalidate(2, boardType = $$props.boardType);
		if ('allowPick' in $$props) $$invalidate(3, allowPick = $$props.allowPick);
		if ('maxPlants' in $$props) $$invalidate(4, maxPlants = $$props.maxPlants);
		if ('setPicks' in $$props) $$invalidate(0, setPicks = $$props.setPicks);
		if ('sunCount' in $$props) $$invalidate(1, sunCount = $$props.sunCount);
	};

	return [setPicks, sunCount, boardType, allowPick, maxPlants];
}

class Game extends SvelteComponent {
	constructor(options) {
		super();

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				boardType: 2,
				allowPick: 3,
				maxPlants: 4,
				setPicks: 0,
				sunCount: 1
			},
			null,
			[-1, -1, -1]
		);
	}
}

export default Game;