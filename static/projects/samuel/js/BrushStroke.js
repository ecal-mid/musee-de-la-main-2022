import { SmoothValue, SmoothPoint, SmoothDampValue } from './Smoother.js'

let MAX_VELOCITY = 0

AudioLoop.setBaseURL('./sounds/')

export class BrushStroke {
  constructor({ p5Graphics, x = 0, y = 0 }) {
    this.p5Graphics = p5Graphics
    this.points = [] //? p5 Vectors array
    this.maxPoints = 65
    this.diameter = new SmoothValue({ smooth: 0.1 })
    this.cursorPoint = new SmoothPoint({ x, y, smooth: 0.3 })
    this.gain = new SmoothPoint({ x, y, smooth: 0.3 })

    this.audio = new AudioLoop({
      file: 'crystal-wine.wav',
      loopEnd: 30,
      pitch: -17,
      volume: -100,
    })

    // console.log(this.audio.player.volume.rampTo())

    //! prevent huge velocity spike when detection starts
    this.audio.setVolume(0, 1, Tone.now() + 5)


    // this.audio.setGain(1)
    // this.gainNode = new Tone.Gain(0).connect(limiter);
    // this.player = new Tone.Player("./sounds/crystal-wine.wav").connect(this.gainNode)
    // this.player.autostart = true;
    // this.player.loop = true
    // this.player.loopEnd = 30;
    // this.player.volume.value = -120;
  }

  draw() {

    // this.updateSound(this.cursorPoint.velocity)
    // this.audio()
    this.audio.woosh(Math.pow(this.cursorPoint.velocity * 10, 1))

    const ctx = this.p5Graphics.drawingContext

    ctx.save()

    ctx.strokeStyle = 'white'
    ctx.lineCap = 'round'

    const points = getCurvePoints(this.points.map(point => {
      // point.z = point.z * 0.99
      return [point.x, point.y, point.z]
    }), 0.5, 4)

    points.reduce((prevPoint, point, index, arr) => {
      let radius = point[2]

      if (radius > 0.01) {
        ctx.beginPath();
        // radius = map(index, 0, arr.length - 1, radius * 0.1, radius);
        ctx.globalAlpha = index / (arr.length - 1)
        ctx.moveTo(prevPoint[0], prevPoint[1])
        ctx.lineTo(point[0], point[1])
        ctx.lineWidth = radius
        ctx.stroke()
      }

      return point
    }, points[0]);

    ctx.restore()
  }

  setWeight(value) {
    this.diameter.follow(value)
  }

  follow(point) {
    // console.log(point.x * width);
    const { x, y } = this.cursorPoint.follow(point)
    const targetPoint = createVector(x * width, y * height, this.diameter.getValue())
    // console.log(targetPoint);
    // console.log(targetPoint);

    const lastPoint = this.getLastPoint() || createVector()

    const distance = targetPoint.dist(lastPoint)

    if (distance > 2) {
      this.addPoint(targetPoint)
    } else {
      this.setLastPoint(targetPoint)
    }
    // }
    // else {
    // this.cursorPoint.set(targetPoint);
    // }
  }

  getLastPoint() {
    const lastPoint = this.points[this.points.length - 1]
    return lastPoint
  }

  setLastPoint(p5Vector) {
    let lastPoint = this.getLastPoint()
    if (!lastPoint) lastPoint = this.addPoint(createVector())

    lastPoint.set(p5Vector)
  }

  showDebug() {
    const lastPoint = this.getLastPoint()

    if (!lastPoint) return

    // ellipse(lastPoint.x, lastPoint.y, 10);
  }

  addPoint(p5Vector, distance = this.distance) {
    const { points, maxPoints } = this
    if (points.length === maxPoints) points.shift()
    points.push(p5Vector)
    return p5Vector
  }
}




function getCurvePoints(pts, tension = 0.5, quality = 16) {

  const points = [...pts], res = []	// clone array
  points.unshift(pts[0]);
  points.push(pts[pts.length - 1]);


  // ok, lets start..

  // 1. loop goes through point array
  // 2. loop goes through each segment between the 2 pts + 1e point before and after
  for (let i = 1; i < points.length - 2; i++) {

    for (let t = 0; t <= quality; t++) {

      // calc tension vectors
      const curr = points[i]
      const next1 = points[i + 1]
      const next2 = points[i + 2]
      const prev1 = points[i - 1]
      const t1x = (next1[0] - prev1[0]) * tension;
      const t2x = (next2[0] - curr[0]) * tension;

      const t1y = (next1[1] - prev1[1]) * tension;
      const t2y = (next2[1] - curr[1]) * tension;

      // calc step
      const st = t / quality;

      // calc cardinals
      const c1 = 2 * Math.pow(st, 3) - 3 * Math.pow(st, 2) + 1;
      const c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
      const c3 = Math.pow(st, 3) - 2 * Math.pow(st, 2) + st;
      const c4 = Math.pow(st, 3) - Math.pow(st, 2);

      // calc x and y cords with common control vectors
      const x = c1 * curr[0] + c2 * next1[0] + c3 * t1x + c4 * t2x;
      const y = c1 * curr[1] + c2 * next1[1] + c3 * t1y + c4 * t2y;

      //store points in array
      res.push([x, y, curr[2]]);

    }
  }

  return res;
}