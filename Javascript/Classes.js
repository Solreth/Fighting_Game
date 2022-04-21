class Sprite {
  constructor({ position, imageSrc }) {
    this.position = position;
    this.height = 140;
    this.width = 70;
    this.image = new Image();
    this.image.src = imageSrc;
  }
  // Creates Sprite
  create() {
    context.drawImage(this.image, this.position.x, this.position.y);
  }

  update() {
    this.create();
  }
}

class PlayerCharacter {
  constructor({ position, velocity, color = "darkgreen", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 140;
    this.width = 70;
    this.color = color;
    this.lastKey;
    this.knockback = false;
    //considering increasing horizontal velocity off double jump
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
    this.lastTime = 0;
    this.isAttacking;
    this.health = 100;
  }
  // Creates PlayerCharacter
  create() {
    context.fillStyle = this.color;
    context.fillRect(this.position.x, this.position.y, 70, 140);

    //basicAttackPosition/color
    if (this.isAttacking && this.knockback === false) {
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
      this.position.y + this.height + this.velocity.y >= canvas.height - 72;

    if (onTheGround) {
      this.doubleJump = false;
      this.velocity.y = 0;
    } else this.velocity.y += gravity;

    let againstLeftBorder = this.position.x + this.velocity.x < 0;

    let againstRightBorder =
      this.position.x + this.width + this.velocity.x >= canvas.width;

    //console.log(againstBorder);

    if (againstLeftBorder) {
      this.position.x = 0;
    }
    if (againstRightBorder) {
      this.position.x = canvas.width - this.width;
    }
  }

  attack() {
    /*uses closure with lastTime to set a mandatory wait period between attacks made
    Returns the numeric value of the specified date as the number of milliseconds since January 1, 1970, 00:00:00 UTC.*/
    const now = new Date().getTime(); // Time in milliseconds
    //ends the function immediately if the collective time of the date - the current point in time is less than the set waiting period (ms)
    if (now - this.lastTime < 825) {
      return;
      //sets the time of lastTime timer to the current point in time and doesnt end the function, allowing the attack to trigger
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
