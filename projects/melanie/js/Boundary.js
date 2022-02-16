class Boundary {
  constructor(x, y, w, group, MATTER, ratio) {
    this.MATTER = MATTER;
    const options = {
      friction: 0,
      restitution: 0.5,
      isStatic: true,
    };

    if (group) options.collisionFilter = { group };
    this.ratio = ratio;
    this.body = this.MATTER.Bodies.circle(x, y, w, options);
    this.MATTER.World.add(this.MATTER.engine.world, this.body);
  }

  show(ctx) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = `rgb(255,204,0)`;
    ctx.beginPath();
    ctx.arc(
      this.body.position.x,
      this.body.position.y,
      this.body.circleRadius,
      0,
      Math.PI * 2,
      false
    );
    ctx.stroke();
    ctx.closePath();
  }
  removeFromWorld() {
    this.MATTER.World.remove(this.MATTER.engine.world, this.body);
    // MATTER.World.remove(MATTER.engine.world, this.body);
  }
}
