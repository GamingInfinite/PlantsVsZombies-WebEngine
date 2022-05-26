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
	PlantHealth
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

function sunHitTest(x, y, sunx, suny, width, height) {
	return x >= sunx && x <= sunx + width && y > suny && y <= suny + height;
}

function instance($$self, $$props, $$invalidate) {
	let { boardType } = $$props;
	let { allowPick = false } = $$props;
	let { maxPlants = 1 } = $$props;
	let { setPicks = [Plants.SUNFLOWER] } = $$props;
	let { sunCount = 50 } = $$props;
	let rechargeTime = [];
	let sunFall = [0, 600];
	var boardInUse;
	var boardXOffset;
	var boardYOffset;
	var laneHeight;
	var laneWidth;
	var tileWidth;
	var packetsOffset;

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
	let selectedX;
	let selectedY;
	var lanes = [];
	var loadedPorts = [];
	var resourceImages = [];

	var seedPortaits = [
		PacketPortraitPaths.SUNFLOWER,
		PacketPortraitPaths.PEASHOOTER,
		PacketPortraitPaths.BONKCHOY
	];

	var plantAnims = [];

	function loadImages() {
		var packetBG = new Image();
		var sunIcon = new Image();
		packetBG.src = PacketPortraitPaths.BG;
		sunIcon.src = "images/resources/sun/sun.png";
		resourceImages.push(sunIcon);
		loadedPorts.push(packetBG);

		for (let i = 0; i < maxPlants; i++) {
			let plantPort = new Image();
			plantPort.src = seedPortaits[setPicks[i]];
			loadedPorts.push(plantPort);
			let plantIdle = [];

			for (let j = 0; j < PlantAnimFrameCounts[i]; j++) {
				let plantFrame = new Image();
				plantFrame.src = PlantAnimPaths.SUNFLOWER + j + ".png";

				if (PlantIdleFrameOrder[i].includes(j)) {
					plantIdle.push(plantFrame);
				}
			}

			plantAnims.push(plantIdle);
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
	function drawSeedPackets(ctx, height, width) {
		for (let i = 0; i < maxPlants; i++) {
			if (selectedSeed == i) {
				ctx.globalAlpha = 0.5;
				drawPacket(ctx, height, width, i);
				ctx.globalAlpha = 1;
				drawPacketAtCursor(ctx, width, i);
			} else {
				drawPacket(ctx, height, width, i);
				let plantId = setPicks[i];

				if (PlantSunCost[plantId] > sunCount || rechargeTime[i][0] < rechargeTime[i][1]) {
					ctx.fillStyle = "#000";
					ctx.globalAlpha = 0.25;
					ctx.roundRect(packetsOffset + width * 0.12 * i, height * 0.01, width * 0.11, laneHeight, 8);
					ctx.fill();
					ctx.globalAlpha = 1;
				}

				if (rechargeTime[i][0] < rechargeTime[i][1]) {
					let heightFraction = 1 - rechargeTime[i][0] / rechargeTime[i][1];
					ctx.fillStyle = "#000";
					ctx.globalAlpha = 0.25;
					ctx.roundRect(packetsOffset + width * 0.12 * i, height * 0.01, width * 0.11, laneHeight * heightFraction, 8);
					ctx.fill();
					ctx.globalAlpha = 1;
				}
			}
		}
	}

	function drawPacket(ctx, height, width, i) {
		//Draw BG
		ctx.drawImage(loadedPorts[0], packetsOffset + width * 0.12 * i, height * 0.01, width * 0.11, laneHeight);

		//Draw Portrait
		ctx.drawImage(loadedPorts[i + 1], packetsOffset + width * 0.12 * i, height * 0.01, width * 0.11, laneHeight);
	}

	function drawPacketAtCursor(ctx, width, i) {
		//Draw BG
		ctx.drawImage(loadedPorts[0], selectedX - width * 0.11 / 2, selectedY - laneHeight / 2, width * 0.11, laneHeight);

		//Draw Portrait
		ctx.drawImage(loadedPorts[i + 1], selectedX - width * 0.11 / 2, selectedY - laneHeight / 2, width * 0.11, laneHeight);
	}

	var plantsToBeDrawn = [];
	var sunToBeDrawn = [];

	//Drawing Plants | Add support for animations later !!IMPORTANT!!
	function drawPlants(ctx) {
		let plantXOffset = tileWidth * 0.2;
		let plantYOffset = laneHeight * 0.06;

		for (let i = 0; i < plantsToBeDrawn.length; i++) {
			const element = plantsToBeDrawn[i];
			let firstFrame = plantAnims[element.plant][0];
			let tileX = element.tile[0];
			let tileY = element.tile[1];

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

	//Drawing Sun Hud
	function drawSunCount(ctx, height, width) {
		let sunIconXOffset = width * 0.003;
		let sunIconYOffset = height * 0.025;
		let sunCountXOffset = width * 0.055;
		let sunCountYOffset = height * 0.095;
		let sunBgXOffset = width * 0.05 - 20;
		let sunBgYOffset = height * 0.095 - 40;
		ctx.globalAlpha = 0.5;
		ctx.fillStyle = "#000";
		ctx.roundRect(sunBgXOffset, sunBgYOffset, 100, 50, 8);
		ctx.fill();
		ctx.globalAlpha = 1;
		ctx.font = "40px CafeteriaBlack";
		ctx.fillStyle = "#FFF";
		ctx.fillText(sunCount, sunCountXOffset, sunCountYOffset);
		ctx.fillStyle = "#000";
		ctx.strokeText(sunCount, sunCountXOffset, sunCountYOffset);
		ctx.drawImage(resourceImages[0], sunIconXOffset, sunIconYOffset, 100, 100);
	}

	getBoardJson(boardType);
	parseLanes();
	loadImages();
	getPacketRecharge();

	function update() {
		boardXOffset = window.innerWidth * 0.15;
		boardYOffset = window.innerHeight * 0.2;
		packetsOffset = window.innerWidth * 0.1;
		laneHeight = (window.innerHeight - window.innerHeight * 0.3) / 5;
		laneWidth = window.innerWidth * 0.8;
		tileWidth = laneWidth / 9;

		for (let i = 0; i < maxPlants; i++) {
			if (rechargeTime[i][0] < rechargeTime[i][1]) {
				rechargeTime[i][0] += 1;
			}
		}

		if (sunFall[0] == sunFall[1]) {
			let newSun = {
				posX: Math.floor(Math.random() * laneWidth) + boardXOffset - 100,
				posY: -100,
				width: 100,
				height: 100,
				lowestY: boardYOffset + laneHeight * 4 - 100,
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
					element.posY += 2 * (element.posY / (window.innerHeight * 0.025));
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

		//Draw Projectiles (Sun, Peas, Darts, What have you)
		drawSunObjects(ctx);

		//Draw Zombies
		//put function here
		//Draw Foreground
		//put function here
		//Draw HUD (Seeds, Shovel, Sun Count, etc.)
		drawSeedPackets(ctx, height, width);

		drawSunCount(ctx, height, width);
	}

	onMount(() => {
		let eventGame = document.getElementById("game");

		eventGame.onmousedown = function (e) {
			if (selectedSeed == -1) {
				//Sun Collection Code
				for (let i = 0; i < sunToBeDrawn.length; i++) {
					const element = sunToBeDrawn[i];

					if (sunHitTest(e.clientX, e.clientY, element.posX, element.posY, element.width, element.height) && !element.collected) {
						element.collected = true;
						$$invalidate(0, sunCount = parseInt(sunCount) + element.value);
					}
				}
			} else {
				for (let i = 0; i < lanes.length; i++) {
					for (let j = 0; j < 9; j++) {
						if (lanes[i] == "dirt") {
							break;
						}

						if (tileHitTest(e.clientX, e.clientY, i, j)) {
							let audio = new Audio("audio/plant1.ogg");
							audio.play();
							let selectedPlantString = Object.keys(Plants)[selectedSeed];
							let drawObject = { plant: selectedPlantString, tile: [j, i] };
							$$invalidate(0, sunCount -= PlantSunCost[selectedSeed]);
							rechargeTime[selectedSeed][0] = 0;
							plantsToBeDrawn.push(drawObject);
							plantFunctions[selectedSeed](j, i);
						}
					}
				}
			}

			selectedX = e.clientX;
			selectedY = e.clientY;
		};

		eventGame.onmouseup = function (e) {
			if (selectedSeed == -1) {
				for (let i = 0; i < maxPlants; i++) {
					if (PlantSunCost[i] > sunCount) {
						break;
					}

					if (rechargeTime[i][0] < rechargeTime[i][1]) {
						break;
					}

					if (seedPacketHitTest(e.clientX, e.clientY, i)) {
						selectedSeed = i;
					}
				}
			} else {
				selectedSeed = -1;
			}
		};

		eventGame.onmousemove = function (e) {
			if (selectedSeed == -1) {
				return;
			}

			selectedX = e.clientX;
			selectedY = e.clientY;
		};
	});

	function seedPacketHitTest(x, y, i) {
		let width = window.innerWidth;
		let height = window.innerHeight;
		let packetStartX = boardXOffset + width * 0.12 * i;
		let packetStartY = height * 0.01;
		let packetWidth = width * 0.11;
		let packetHeight = laneHeight;
		return x >= packetStartX && x <= packetStartX + packetWidth && y >= packetStartY && y <= packetStartY + packetHeight;
	}

	function tileHitTest(x, y, i, j) {
		let packetStartX = boardXOffset + j * tileWidth;
		let packetStartY = i * laneHeight + boardYOffset;
		let packetWidth = tileWidth;
		let packetHeight = laneHeight + 1;
		return x >= packetStartX && x <= packetStartX + packetWidth && y >= packetStartY && y <= packetStartY + packetHeight;
	}

	setInterval(
		() => {
			update();
			draw();
		},
		1000 / FPS
	);

	//PLANT LOOPS.  I literally am going to go insane.  I need to debug these each INDIVIDUALLY.  Like some are similar but this is going to be hell.
	const plantFunctions = [sunflower];

	var plants = [];
	var plantHealthControl = [];
	var plantActionTimers = [];

	function sunflower(tileX, tileY) {
		plants.push(setInterval(sunflowerCallback, 1000 / FPS, tileX, tileY, plants.length));
		plantHealthControl.push(PlantHealth.SUNFLOWER);
		plantActionTimers.push([0, Math.floor(Math.random() * 240) + 1920]);
	}

	function sunflowerCallback(tileX, tileY, id) {
		let tileStartX = boardXOffset + tileX * tileWidth;
		let tileStartY = tileY * laneHeight + boardYOffset;
		let plantXOffset = tileWidth * 0.2;
		let plantYOffset = laneHeight * 0.06;

		if (plantActionTimers[id][0] >= plantActionTimers[id][1]) {
			sunToBeDrawn.push({
				posX: tileStartX + plantXOffset + 50,
				posY: tileStartY + plantYOffset,
				width: 100,
				height: 100,
				lowestY: tileStartY + laneHeight - 100,
				lifetime: [0, 480],
				collected: false,
				value: 25
			});

			plantActionTimers[id][0] = 0;
			plantActionTimers[id][1] = Math.floor(Math.random() * 240) + 1920;
		} else if (plantActionTimers[id][0] < plantActionTimers[id][1]) {
			plantActionTimers[id][0] += 1;
		}
	}

	$$self.$$set = $$props => {
		if ('boardType' in $$props) $$invalidate(1, boardType = $$props.boardType);
		if ('allowPick' in $$props) $$invalidate(2, allowPick = $$props.allowPick);
		if ('maxPlants' in $$props) $$invalidate(3, maxPlants = $$props.maxPlants);
		if ('setPicks' in $$props) $$invalidate(4, setPicks = $$props.setPicks);
		if ('sunCount' in $$props) $$invalidate(0, sunCount = $$props.sunCount);
	};

	return [sunCount, boardType, allowPick, maxPlants, setPicks];
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
				boardType: 1,
				allowPick: 2,
				maxPlants: 3,
				setPicks: 4,
				sunCount: 0
			},
			null,
			[-1, -1]
		);
	}
}

export default Game;