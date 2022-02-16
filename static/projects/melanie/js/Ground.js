class Ground {
  constructor() {
    this.heightSize = 8;
    this.ground = null
  }
  groundLimit(MATTER, width, height) {
    const options = {
      isStatic: true,
    };

    // const h = width / window.innerWidth * window.innerHeight

    console.log(height)

    this.ground = MATTER.Bodies.rectangle(
      width/2,
      height + 25,
      width,
      50,
      options
    );

    // this.ground2 = MATTER.Bodies.rectangle(
    //   0,
    //   height,
    //   this.heightSize,
    //   height / 2,
    //   options
    // );
    // this.ground3 = MATTER.Bodies.rectangle(
    //   width,
    //   height,
    //   this.heightSize,
    //   height / 2,
    //   options
    // );
    MATTER.World.add(MATTER.engine.world, this.ground);
    // MATTER.engine.world.setBounds(0, 0, width, height);
    // MATTER.World.add(MATTER.engine.world, this.ground2);
    // MATTER.World.add(MATTER.engine.world, this.ground3);
  }
  removeFromWorld(MATTER) {
    MATTER.World.remove(MATTER.engine.world, this.ground);
    // console.log(this.MATTER.engine.world.bodies.length);
    // console.log("removed", this.MATTER.engine.world.bodies.length);
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
