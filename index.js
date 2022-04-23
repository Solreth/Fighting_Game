const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

let gameOver = false;
let timer = 100;
let clock;
const gravity = 0.9;
// future horizontal movement const shift = 1;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/Background/layer_1.png",
});

const background2 = new Sprite({
  position: {
    x: 0,
    y: 157,
  },
  imageSrc: "./img/Background/layer_2.png",
});

const foreground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/Background/floor_foreground.png",
});

const torch1 = new Sprite({
  position: {
    x: 80,
    y: 360,
  },
  frames: 6,
  imageSrc: "./img/Background/torch.png",
});

const torch2 = new Sprite({
  position: {
    x: 312,
    y: 360,
  },
  frames: 6,
  imageSrc: "./img/Background/torch.png",
});

const torch_background1 = new Sprite({
  position: {
    x: 72,
    y: 388,
  },
  imageSrc: "./img/Background/torch_background.png",
});

const torch_background2 = new Sprite({
  position: {
    x: 304,
    y: 388,
  },
  imageSrc: "./img/Background/torch_background.png",
});
const foreground2 = new Sprite({
  position: {
    x: 0,
    y: 520,
  },
  imageSrc: "./img/Background/layer_3.png",
});

const UI_clock = new Sprite({
  position: {
    x: 467,
    y: 10,
  },
  imageSrc: "./img/UI/clock.png",
});

const player1 = new PlayerCharacter({
  position: {
    x: 150,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "Blue",
  offset: {
    x: 0,
    y: 30,
  },
});

const player2 = new PlayerCharacter({
  position: {
    x: 804,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -70,
    y: 30,
  },
});

const keys = {
  //player1
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,

    //player2
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

function attackCollision({ attacker, victim }) {
  return (
    attacker.basicAttackBox.position.x + attacker.basicAttackBox.width >=
      victim.position.x &&
    attacker.basicAttackBox.position.x <= victim.position.x + victim.width &&
    attacker.basicAttackBox.position.y + attacker.basicAttackBox.height >=
      victim.position.y &&
    attacker.basicAttackBox.position.y <= victim.position.y + victim.height
  );
}

function declareWinner({ player1, player2 }) {
  //cancels the setTimeOut in clockDecrease that decreases the timer every 1000ms
  clock = clearTimeout(clock);
  // changes display from "none" in HTML to show message
  document.querySelector("#gameOver").style.display = "Flex";
  if (player1.health === player2.health) {
    document.querySelector("#gameOver").innerHTML = "Draw";
  }
  if (player1.health > player2.health) {
    document.querySelector("#gameOver").innerHTML = "Player 1 Wins!";
  }
  if (player2.health > player1.health) {
    document.querySelector("#gameOver").innerHTML = "Player 2 Wins!";
  }

  // declares final relevant horizontal movement frame as having no velocity after 400ms
  setTimeout(() => (player1.velocity.x = 0), 400);
  setTimeout(() => (player2.velocity.x = 0), 400);
  //squashes a bug that lets the player slowly increment post death by holding down movement
  setTimeout(() => ((player2.lastkey = ""), (player1.lastKey = "")), 5);
  //disables button inputs after winner is declared (see keys if statement)

  return (gameOver = true);
}

//decreases the timer by 1 and calls itself repeatedly once invoked, every 1000 ms
function clockDecrease() {
  if (timer > 0) {
    clock = setTimeout(clockDecrease, 1000);
    timer--;
    //specifically connects the time decrease directly to the html clock
    document.querySelector("#clock").innerHTML = timer;
  }
  //invokes win conditions based on time
  if (timer === 0) {
    declareWinner({ player1, player2 });
  }
}

clockDecrease();

//creates an infinite loop of requesting animation frames
function animate() {
  window.requestAnimationFrame(animate);
  //updates the position and status of players it creates
  background.update();
  background2.update();
  foreground.update();
  torch_background1.update();
  torch1.update();
  torch_background2.update();
  torch2.update();
  foreground2.update();
  UI_clock.update();
  player1.update();
  player2.update();

  if (player1.knockback === false) player1.velocity.x = 0;
  if (player2.knockback === false) player2.velocity.x = 0;

  //player 1 movement
  if (player1.knockback === false) {
    if (keys.a.pressed && player1.lastKey === "a") {
      player1.velocity.x = -6;
    } else if (keys.d.pressed && player1.lastKey === "d") {
      player1.velocity.x = 6;
    }
  }
  //player 2 movement
  if (player2.knockback === false) {
    if (keys.ArrowLeft.pressed && player2.lastKey === "ArrowLeft") {
      player2.velocity.x = -6;
    } else if (keys.ArrowRight.pressed && player2.lastKey === "ArrowRight") {
      player2.velocity.x = 6;
    }
  }

  //hitbox position relative to other player
  // need to (if player1 position greater than player2 position + (player2 width divided by 2), x = -70)
  if (
    player1.position.x + (player1.width % 2) >
    player2.position.x + (player2.width % 2)
  ) {
    player1.basicAttackBox.offset.x = -70;
  } else player1.basicAttackBox.offset.x = 0;

  // need to (if player2 position less than player1 position + (player1 width divided by 2), x = 0)
  if (
    player2.position.x + (player2.width % 2) <
    player1.position.x + (player1.width % 2)
  ) {
    player2.basicAttackBox.offset.x = 0;
  } else player2.basicAttackBox.offset.x = -70;

  // check for collision

  // player1
  if (
    attackCollision({ attacker: player1, victim: player2 }) &&
    player1.isAttacking
  ) {
    player1.isAttacking = false;
    player2.health -= 20;
    player2.knockback = true;
    setTimeout(() => {
      player2.knockback = false;
    }, 385);
    player2.velocity.y = -10;
    if (
      player1.position.x + (player1.width % 2) <
      player2.position.x + (player2.width % 2)
    ) {
      player2.velocity.x = 10;
    } else player2.velocity.x = -10;

    document.querySelector("#player2Health").style.width = `${player2.health}%`;
    console.log("Player 1 injected you with the boo boo sauce :(");
  }

  //player2
  if (
    attackCollision({ attacker: player2, victim: player1 }) &&
    player2.isAttacking
  ) {
    player2.isAttacking = false;
    player1.health -= 20;
    player1.knockback = true;
    setTimeout(() => {
      player1.knockback = false;
    }, 385);
    player1.velocity.y = -10;
    if (
      player2.position.x + (player2.width % 2) <
      player1.position.x + (player1.width % 2)
    ) {
      player1.velocity.x = 10;
    } else player1.velocity.x = -10;
    document.querySelector("#player1Health").style.width = `${player1.health}%`;
    console.log("Player 2 loaned you a premium ouchie with only 3.5% APR!");
  }

  if (player1.health <= 0 || player2.health <= 0) {
    declareWinner({ player1, player2 });
  }
}

animate();

//keys & controls
window.addEventListener("keydown", ({ key }) => {
  //player 1
  if (gameOver === false) {
    switch (key) {
      case "d":
        keys.d.pressed = true;
        player1.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player1.lastKey = "a";
        break;
      case player1.velocity.y === 0 && "w":
        keys.w.pressed = true;
        player1.doubleJump = true;
        setTimeout(() => {
          player1.doubleJump = false;
        }, 600);
        player1.velocity.y = -19;

        break;
      case player1.doubleJump === true && "w":
        keys.w.pressed = true;
        player1.velocity.y = -12;
        player1.doubleJump = false;
        break;
      case " ":
        player1.attack();
        break;

      //player 2
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        player2.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        player2.lastKey = "ArrowLeft";
        break;
      case player2.velocity.y === 0 && "ArrowUp":
        keys.ArrowUp.pressed = true;
        player2.doubleJump = true;
        setTimeout(() => {
          player2.doubleJump = false;
        }, 600);
        player2.velocity.y = -19;
        break;
      case player2.doubleJump && "ArrowUp":
        keys.ArrowUp.pressed = true;
        player2.velocity.y = -12;
        player2.doubleJump = false;
        break;
      case "ArrowDown":
        player2.attack();
        break;
    }
  }
});

window.addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;

    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});
