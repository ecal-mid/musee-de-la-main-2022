class FaceDetection {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  showFaceDetection(ctx) {
    // const { ctx } = this; //? destructuring

    ctx.lineWidth = 0;
    ctx.strokeStyle = `rgb(255,0,0)`;
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.stroke();
    ctx.closePath();
  }
}
