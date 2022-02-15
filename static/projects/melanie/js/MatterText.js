class MatterText {
    //mettre colonne manuellement
  constructor({textX, textY, text, ctx, MATTER}) {
    this.x = textX;
    this.y = textY;
    this.text = text;

    ctx.font = "100px Roboto-Black";
    ctx.textAlign = "center";
    const bounds = ctx.measureText(text);

    const x = textX - bounds.width / 2;
    const y = textY - bounds.actualBoundingBoxAscent;
    const width = bounds.width;
    const height =
      bounds.actualBoundingBoxAscent + bounds.actualBoundingBoxDescent;

      console.log(x, y, width, height);

    this.textBody = MATTER.Bodies.rectangle(x +width/2, y + height/2, width-20, height, {
      isStatic: true,
    });
    // Matter.Body.setCentre(this.textBody, { x: -width / 2, y: -height / 2 }, true);

    MATTER.World.add(MATTER.engine.world, this.textBody);
  }
  show(ctx) {
    ctx.save();
    ctx.font = "100px Roboto-Black";
    ctx.fillStyle = "white";
    ctx.shadowColor= "black";
    ctx.shadowBlur=  5;
    ctx.lineWidth=5;
    ctx.textAlign = "center";
    ctx.fillText(this.text, this.x, this.y);
   
    ctx.restore();
  }

  removeFromWorld(MATTER) {
    MATTER.World.remove(MATTER.engine.world, this.textBody);
    // console.log(this.MATTER.engine.world.bodies.length);
    // console.log("removed", this.MATTER.engine.world.bodies.length);
  }
}
