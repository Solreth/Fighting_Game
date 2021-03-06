class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    frames = 1,
    playerOffset = { x: 0, y: 0 },
    framesDelay = 4,
  }) {
    this.position = position;
    this.height = 140;
    this.width = 70;
    this.image = new Image();
    this.image.src = imageSrc;
    this.frames = frames;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesDelay = framesDelay;
    this.scale = scale;
    this.playerOffset = playerOffset;
  }
  // Creates Sprite
  create() {
    context.drawImage(
      this.image,
      //cropping from here
      // multiply the current frame by separated animation (by max frames) to determine where =the leftside crop position is
      this.currentFrame * (this.image.width / this.frames),
      0,
      //crops at the rightside edge of the first frame
      this.image.width / this.frames,
      //crops at image height
      this.image.height,
      // to here^ for animations
      this.position.x + this.playerOffset.x,
      this.position.y + this.playerOffset.y,
      (this.image.width / this.frames) * this.scale,
      this.image.height * this.scale
    );
    //basicAttackPosition/color
    if (
      this.isAttacking &&
      this.knockback === false &&
      this.currentFrame === 4
    ) {
      context.fillStyle = "transparent";
      context.fillRect(
        this.basicAttackBox.position.x,
        this.basicAttackBox.position.y,
        this.basicAttackBox.width,
        this.basicAttackBox.height
      );
    }
  }

  animateFrame() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesDelay === 0) {
      if (this.currentFrame < this.frames - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }

  update() {
    this.create();
    this.animateFrame();
  }
}

class PlayerCharacter extends Sprite {
  constructor({
    position,
    velocity,
    offset,
    imageSrc,
    scale = 1,
    frames = 1,
    playerOffset = { x: 0, y: 0 },
    framesDelay,
    states,
  }) {
    super({ position, imageSrc, scale, frames, playerOffset, framesDelay });

    this.states = states;
    this.velocity = velocity;
    this.height = 140;
    this.width = 70;
    // potential solution, if no movement option valid, then last key pressed = last lastkey pressed
    this.lastKey;
    this.knockback = false;
    //considering increasing horizontal velocity off double jump, tbd
    this.doubleJump = false;
    this.basicAttackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 170,
      height: 75,
    };
    this.lastTime = 0;
    this.isAttacking;
    this.health = 100;
    this.dead = false;

    for (const state in this.states) {
      states[state].image = new Image();
      states[state].image.src = states[state].imageSrc;
    }
  }

  update() {
    this.create();
    //console.log(player1.currentFrame);
    this.basicAttackBox.position.x =
      this.position.x + this.basicAttackBox.offset.x;

    this.basicAttackBox.position.y =
      this.position.y + this.basicAttackBox.offset.y;

    if (!this.dead) {
      // pushes frames forward in animation, based on division of current passed frames by delay returning a remainder of 0
      this.animateFrame();
    }
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    let onTheGround =
      this.position.y + this.height + this.velocity.y >= canvas.height - 72;

    if (onTheGround) {
      this.doubleJump = false;
      this.velocity.y = 0;
      // kills the bug surrounding additional falling animations by setting position exactly equal to the ground
      this.position.y = 364.6;
    } else this.velocity.y += gravity;

    let againstLeftBorder = this.position.x + this.velocity.x < 0;

    let againstRightBorder =
      this.position.x + this.width + this.velocity.x >= canvas.width;

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
    if (this.health > 0) {
      this.isAttacking = true;
      this.switchState("attacking");
    }
  }

  attackOpposite() {
    const now = new Date().getTime(); // Time in milliseconds

    if (now - this.lastTime < 825) {
      return;
    } else {
      this.lastTime = now;
    }
    //initiates the hitbox
    this.isAttacking = true;
    if (this.health > 0) this.switchState("attackingOpposite");
  }

  takeHit() {
    this.health -= 20;
    this.switchState("getHit");
  }

  switchState(state) {
    //everything above the switch is designed to override it

    /*
    
    current issue is that current frames on start of death animation is starting at 4 and counting upwards before ending precisely on 7 
    for an unknown reason, causing the timing of this.dead to fall off mark
    */

    if (player1.image === player1.states.death.image) {
      this.currentFrame === 0;
      if (player1.currentFrame === player1.states.death.frames - 1) {
        return (player1.dead = true);
      }
    }

    if (player2.image === player2.states.death.image) {
      this.currentFrame === 0;
      if (player2.currentFrame === player1.states.death.frames - 1) {
        return (player2.dead = true);
      }
    }

    if (
      this.image === this.states.getHit.image &&
      this.currentFrame < this.states.getHit.frames - 1
    ) {
      return;
    }
    //attack override
    if (
      this.image === this.states.attacking.image &&
      this.currentFrame < this.states.attacking.frames - 1 &&
      this.health > 0
    ) {
      //plants your attack if grounded
      if (this.velocity.y === 0) {
        this.velocity.x = 0;
      } //speeds up the attack visually, independent from the other animations
      this.framesDelay = 4;
      return;
    } else this.framesDelay = 7;
    // opposite attack override
    if (
      this.image === this.states.attackingOpposite.image &&
      this.currentFrame < this.states.attackingOpposite.frames - 1 &&
      this.health > 0
    ) {
      //plants your attack if grounded
      if (this.velocity.y === 0) {
        this.velocity.x = 0;
      } //speeds up the attack visually, independent from the other animations
      this.framesDelay = 4;
      return;
    } else this.framesDelay = 7;

    switch (state) {
      case "idle":
        if (this.image !== this.states.idle.image && this.health) {
          this.image = this.states.idle.image;
          this.frames = this.states.idle.frames;
          this.currentFrame = 0;
        }
        break;
      case "idleOpposite":
        if (this.image !== this.states.idleOpposite.image) {
          this.image = this.states.idleOpposite.image;
          this.frames = this.states.idleOpposite.frames;
          this.currentFrame = 0;
        }
        break;
      case "run":
        if (this.image !== this.states.run.image) {
          //sets the src image of the respective model (and the images frames)
          this.frames = this.states.run.frames;
          this.image = this.states.run.image;
          this.currentFrame = 0;
          //makes sure there are no frame overlaps when switching animations (resulting in blank flashes)
        }
        break;
      case "runOpposite":
        if (this.image !== this.states.runOpposite.image) {
          //sets the src image of the respective model (and the images frames)
          this.frames = this.states.runOpposite.frames;
          this.image = this.states.runOpposite.image;
          this.currentFrame = 0;
          //makes sure there are no frame overlaps when switching animations (resulting in blank flashes)
        }
        break;
      case "walking":
        if (this.image !== this.states.walking.image) {
          this.frames = this.states.walking.frames;
          this.image = this.states.walking.image;
          this.currentFrame = 0;
        }
        break;

      case "walkingOpposite":
        if (this.image !== this.states.walkingOpposite.image) {
          this.frames = this.states.walkingOpposite.frames;
          this.image = this.states.walkingOpposite.image;
          this.currentFrame = 0;
        }
        break;
      case "jumping":
        if (this.image !== this.states.jumping.image) {
          this.frames = this.states.jumping.frames;
          this.image = this.states.jumping.image;
          this.currentFrame = 0;
        }
        break;
      case "jumpingOpposite":
        if (this.image !== this.states.jumpingOpposite.image) {
          this.frames = this.states.jumpingOpposite.frames;
          this.image = this.states.jumpingOpposite.image;
          this.currentFrame = 0;
        }
        break;
      case "attacking":
        if (this.health <= 0) {
          this.switchstate("death");
        } else if (this.image !== this.states.attacking.image) {
          this.frames = this.states.attacking.frames;
          this.image = this.states.attacking.image;
          this.currentFrame = 0;
        }
        break;
      case "attackingOpposite":
        if (this.image !== this.states.attackingOpposite.image) {
          this.frames = this.states.attackingOpposite.frames;
          this.image = this.states.attackingOpposite.image;
          this.currentFrame = 0;
        }
        break;
      case "falling":
        if (this.image !== this.states.falling.image) {
          this.frames = this.states.falling.frames;
          this.image = this.states.falling.image;
          this.currentFrame = 0;
        }
        break;
      case "fallingOpposite":
        if (this.image !== this.states.fallingOpposite.image) {
          this.frames = this.states.fallingOpposite.frames;
          this.image = this.states.fallingOpposite.image;
          this.currentFrame = 0;
        }
        break;
      case "getHit":
        if (this.health <= 0) {
          this.switchState("death");
        } else if (this.image !== this.states.getHit.image) {
          this.frames = this.states.getHit.frames;
          this.image = this.states.getHit.image;
          this.currentFrame = 0;
        }

        break;
      case "death":
        if (this.image !== this.states.death.image) {
          this.currentFrame = 0;
          this.frames = this.states.death.frames;
          this.image = this.states.death.image;
        }
    }
  }
}
