class Circle {
  constructor(x, y, r, group, MATTER) {
    this.MATTER = MATTER;
    let options = {
      friction: 0,
      // restitution: 0.5,
      // frictionAir: 0.07,
      // frictionAir: this.friction,
      restitution: 0.4,
    };

    if (group) options.collisionFilter = { group };

    this.friction = Math.random() * 0.004;

    this.body = this.MATTER.Bodies.circle(x, y, r, options);
    this.r = r;
    let colors = ["#FFFFFF", "#000000"];
    this.c = Math.random() < 0.5 ? colors[0] : colors[1];

    this.MATTER.World.add(this.MATTER.engine.world, this.body);

      
      const targetAngle = randomRange(0, Math.PI * 2);
      const force = randomRange(-1, 1) * 0.1;
      this.MATTER.Body.applyForce(this.body, this.body.position, {
        x: Math.cos(targetAngle) * force,
        y: Math.sin(targetAngle) * force,
      });
      // console.log(this);

    this.img = undefined;
  }

  show(ctx) {
    // console.log("show");
    var pos = this.body.position;

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.rotate(this.body.angle);

    ctx.beginPath();
    ctx.ellipse(0, 0, this.r, this.r, 0, Math.PI * 2, false);

    // ctx.closePath();

    try {
      if (this.img && this.img.complete) {
        ctx.clip();
        const diameter = this.r * 2;

        const { width, height } = this.img;
        // const width = this.img.width;
        // const height = this.img.height;

        const x = -width / 2;
        const y = -height / 2;

        const smallestSide = Math.min(width, height);
        const scaleFactor = diameter / smallestSide;
        ctx.scale(scaleFactor, scaleFactor);
        ctx.drawImage(this.img, x, y, width, height);
      } else {
        ctx.fillStyle = this.c;
        // ctx.shadowColor= "transparent";
        ctx.fill();
      }
    } catch (e) {
      console.log(e);
    }

    ctx.restore();
  }

  addImage(imgObject) {
    //? new Image(), not url
    this.img = imgObject;
  }

  removeFromWorld() {
    this.MATTER.World.remove(this.MATTER.engine.world, this.body);
    // console.log(this.MATTER.engine.world.bodies.length);
    // console.log("removed", this.MATTER.engine.world.bodies.length);
  }
}
