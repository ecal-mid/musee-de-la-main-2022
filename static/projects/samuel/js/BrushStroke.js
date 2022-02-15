class BrushStroke {
  constructor({ p5Graphics }) {
    this.p5Graphics = p5Graphics;
    this.points = []; //? p5 Vectors array
    this.maxPoints = 65;
    this.diameter = new SmoothValue({ smooth: 0.01 });
    this.cursorPoint = new SmoothPoint({ smooth: 0.1 });
  }

  draw() {
    const { p5Graphics, points, x } = this; // destructuring

    p5Graphics.push();

    p5Graphics.beginShape();
    p5Graphics.stroke(255);
    p5Graphics.noFill();
    maskLayer.strokeWeight(this.diameter.getValue());

    // console.log(points);
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      p5Graphics.curveVertex(point.x, point.y);
    }

    // draw masked capture
    // ctx.stroke();

    p5Graphics.endShape();
  }

  setWeight(value) {
    this.diameter.follow(value);
  }

  follow(point) {
    // console.log(point.x * width);
    const { x, y } = this.cursorPoint.follow(point);
    const targetPoint = createVector(x * width, y * height);
    // console.log(targetPoint);
    // console.log(targetPoint);

    const lastPoint = this.getLastPoint() || createVector();

    const distance = targetPoint.dist(lastPoint);

    if (distance > 2) {
      this.addPoint(targetPoint);
    } else {
      this.setLastPoint(targetPoint);
    }
    // }
    // else {
    // this.cursorPoint.set(targetPoint);
    // }
  }

  getLastPoint() {
    const lastPoint = this.points[this.points.length - 1];
    return lastPoint;
  }

  setLastPoint(p5Vector) {
    let lastPoint = this.getLastPoint();
    if (!lastPoint) lastPoint = this.addPoint(createVector());

    lastPoint.set(p5Vector);
  }

  showDebug() {
    const lastPoint = this.getLastPoint();

    if (!lastPoint) return;

    // ellipse(lastPoint.x, lastPoint.y, 10);
  }

  addPoint(p5Vector) {
    const { points, maxPoints } = this;
    if (points.length === maxPoints) points.shift();
    points.push(p5Vector);
    return p5Vector;
  }
}
