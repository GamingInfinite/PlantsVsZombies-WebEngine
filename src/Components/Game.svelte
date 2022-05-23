<script>
  import { Plants } from "../plants.ts";

  export let boardType;
  export let allowPick = true;
  export let maxPlants = 6;
  export let setPicks = [Plants.PEASHOOTER];

  var boardInUse;

  var FPS = 60;

  let boards = [
    {
      name: "frontLawn",
      lanes: [
        {
          type: "grass",
          number: 5,
        },
      ],
      colors: [0, 1, 0, 1, 0],
    },
    {
      name: "tutorial1",
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
      colors: [0, 0, 0, 0, 0],
    },
  ];

  let types = [
    {
      name: "grass",
      colors: ["#154f1a", "#33b83e"],
    },
    {
      name: "dirt",
      colors: ["#836539"],
    },
  ];

  var lanes = [];

  function getBoardJson(boardKey) {
    for (let i = 0; i < boards.length; i++) {
      const element = boards[i];

      if (element.name == boardKey) {
        boardInUse = element;
      }
    }
  }

  function parseLanes() {
    for (let i = 0; i < boardInUse.lanes.length; i++) {
      const element = boardInUse.lanes[i];
      for (let j = 0; j < element.number; j++) {
        lanes.push(element.type);
      }
    }
  }

  function getLaneJson(laneKey) {
    for (let i = 0; i < types.length; i++) {
      const element = types[i];
      if (element.name == laneKey) {
        return element;
      }
    }
  }

  function drawBoard(ctx, height, width) {
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
          ctx.fillRect(
            width * 0.1 + j * (width * 0.09445),
            i * ((height - height * 0.3) / 5) + height * 0.2,
            width * 0.09445,
            (height - height * 0.3) / 5 + 1
          );
        }
      } else {
        ctx.fillStyle = getLaneJson(element).colors[boardInUse.colors[i]];
        ctx.fillRect(
          width * 0.1,
          i * ((height - height * 0.3) / 5) + height * 0.2,
          width * 0.85,
          (height - height * 0.3) / 5 + 1
        );
      }
    }
  }

  getBoardJson(boardType);
  parseLanes();
  getLaneJson("grass");

  function update() {}

  function draw() {
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    let height = window.innerHeight;
    let width = window.innerWidth;
    canvas.height = height;
    canvas.width = width;
    drawBoard(ctx, height, width);
  }

  setInterval(() => {
    update();
    draw();
  }, 1000 / FPS);
</script>

<div id="gameWrapper">
  <canvas id="game" width="1920" height="1080" />
</div>

<style>
  #game {
    height: 100%;
    width: 100%;
  }
</style>
