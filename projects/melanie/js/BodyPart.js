class BodyPart {
  constructor(x, y, w, h, group, MATTER) {
    this.MATTER = MATTER;
    const options = {
      friction: 0,
      restitution: 0.5,
      isStatic: true,
    };
    this.w = w;
    this.h = h;

    if (group) options.collisionFilter = { group };
    this.body = this.MATTER.Bodies.rectangle(x, y, w, h, options);

    this.MATTER.Body.setCentre(this.body, { x: -w / 2, y: -h / 2 }, true);

    this.MATTER.World.add(this.MATTER.engine.world, this.body);
  }
  position(x, y) {
    this.MATTER.Body.setPosition(this.body, {
      x: x,
      y: y,
    });
  }
  resize(width) {
    // Matter.Body.scale(this.body, {
    //   w: width,
    //   h:40,
    // });
    this.w = width;
    
    // Matter.Body.scale(body, scaleX, scaleY, [point])
  }

  rotate(angle) {
    this.MATTER.Body.setAngle(this.body, angle);
  }
  show(ctx) {
    ctx.save();
    ctx.translate(this.body.position.x, this.body.position.y);
    ctx.rotate(this.body.angle);
    ctx.lineWidth = 5;
    ctx.strokeStyle = `rgb(255,204,0)`;
    ctx.beginPath();
    ctx.rect(0, 0, this.w, this.h);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  }
  removeFromWorld() {
    this.MATTER.World.remove(this.MATTER.engine.world, this.body);
    // MATTER.World.remove(MATTER.engine.world, this.body);
  }
}
