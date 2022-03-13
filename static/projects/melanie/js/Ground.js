class Ground {
  constructor(MATTER, x, y, width, height) {

    const options = {
      isStatic: true,
    }

    const centerX = x + width / 2
    const centerY = y + height / 2

    this.ground = MATTER.Bodies.rectangle(
      centerX,
      centerY,
      width,
      height,
      options
    )

    MATTER.World.add(MATTER.engine.world, this.ground)
  }
  removeFromWorld(MATTER) {
    MATTER.World.remove(MATTER.engine.world, this.ground)
  }

  // show(ctx) {
  //   let pos = this.ground.position;
  //   let angle = this.ground.angle;

  //   ctx.save();
  //   ctx.translate(pos.x, pos.y);
  //   ctx.rotate(angle);
  //   ctx.strokeStyle = 'red'
  //   ctx.rect(-this.w/2, -this.h/2, this.w, this.h);
  //   ctx.pop();
  // }
}
