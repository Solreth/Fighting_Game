const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.9;

class PlayerCharacter {
  // fires everytime we create a new object from the PlayerCharacter class
  constructor({ position, velocity, color = "green", offset, lastTime = 0 }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 140;
    this.width = 70;
    this.color = color;
    this.lastKey;
    this.doubleJump = false;
    this.basicAttackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 140,
      height: 50,
    };
    this.isAttacking;
  }
  // Creates PlayerCharacter
  create() {
    context.fillStyle = this.color;
    context.fillRect(this.position.x, this.position.y, 70, 140);

    //basicAttackPosition/color
    if (this.isAttacking) {
      context.fillStyle = "orange";
      context.fillRect(
        this.basicAttackBox.position.x,
        this.basicAttackBox.position.y,
        this.basicAttackBox.width,
        this.basicAttackBox.height
      );
    }
  }

  update() {
    this.basicAttackBox.position.x =
      this.position.x + this.basicAttackBox.offset.x;

    this.basicAttackBox.position.y =
      this.position.y + this.basicAttackBox.offset.y;

    this.create();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    let onTheGround =
      this.position.y + this.height + this.velocity.y >= canvas.height;

    // if player position+height+velocity greater than canvas bottom, stop velocity. Else apply gravity+velocity (fall speed increases incrementally over time)
    if (onTheGround) {
      this.doubleJump = false;
      this.velocity.y = 0;
    } else this.velocity.y += gravity;

    let againstBorder =
      this.position.x + this.velocity.x < 0 ||
      this.position.x + this.width + this.velocity.x >= canvas.width;

    //console.log(againstBorder);

    if (againstBorder) {
    }
  }

  attack() {
    //uses closure with lastTime to set a mandatory wait period between attacks made
    const now = new Date().getTime(); // Time in milliseconds
    if (now - this.lastTime < 925) {
      return;
    } else {
      this.lastTime = now;
    }
    //initiates the hitbox
    this.isAttacking = true;
    // 100ms after initiation this disables the hitbox
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player1 = new PlayerCharacter({
  position: {
    x: 150,
    y: 0,
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
    y: 0,
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

let lastKey;

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

function collision({ attacker, victim }) {
  return (
    attacker.basicAttackBox.position.x + attacker.basicAttackBox.width >=
      victim.position.x &&
    attacker.basicAttackBox.position.x <= victim.position.x + victim.width &&
    attacker.basicAttackBox.position.y + attacker.basicAttackBox.height >=
      victim.position.y &&
    attacker.basicAttackBox.position.y <= victim.position.y + victim.height
  );
}

//creates an infinite loop of requesting animation frames
function animate() {
  window.requestAnimationFrame(animate);
  // resets the background as black so it doesnt fill red
  context.fillStyle = "black";
  //sets the size of the colored reset
  context.fillRect(0, 0, canvas.width, canvas.height);
  //updates the position and status of players it creates
  player1.update();
  player2.update();

  player1.velocity.x = 0;
  player2.velocity.x = 0;

  //player 1 movement
  if (keys.a.pressed && player1.lastKey === "a") {
    player1.velocity.x = -6;
  } else if (keys.d.pressed && player1.lastKey === "d") {
    player1.velocity.x = 6;
  }

  //player 2 movement
  if (keys.ArrowLeft.pressed && player2.lastKey === "ArrowLeft") {
    player2.velocity.x = -6;
  } else if (keys.ArrowRight.pressed && player2.lastKey === "ArrowRight") {
    player2.velocity.x = 6;
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
  if (
    collision({ attacker: player1, victim: player2 }) &&
    player1.isAttacking
  ) {
    player1.isAttacking = false;
    console.log("Player 1 injected you with the boo boo sauce :(");
  }

  if (
    collision({ attacker: player2, victim: player1 }) &&
    player2.isAttacking
  ) {
    player2.isAttacking = false;
    console.log("Player 2 loaned you a premium ouchie with only 3.5% APR!");
  }
}

animate();

window.addEventListener("keydown", (event) => {
  //player 1
  switch (event.key) {
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
      setTimeout(() => {
        player1.doubleJump = false;
      }, 600);
      player1.doubleJump = true;
      player1.velocity.y = -18;
      break;
    case player1.doubleJump === true && "w":
      keys.w.pressed = true;
      player1.velocity.y = -11;
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
      player2.velocity.y = -18;
      break;
    case player2.doubleJump && "ArrowUp":
      keys.ArrowUp.pressed = true;
      player2.velocity.y = -11;
      player2.doubleJump = false;
      break;
    case "ArrowDown":
      player2.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
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
