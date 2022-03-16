export class SmoothPoint {
  constructor(options = {}) {
    const defaults = {
      x: 0,
      y: 0,
      smooth: 0.05,
    };
    Object.assign(this, defaults, options);

    this._x = this.x
    this._y = this._y
    this.velocity = 0
    this.x = new SmoothValue({ value: this.x, smooth: this.smooth });
    this.y = new SmoothValue({ value: this.y, smooth: this.smooth });
  }

  follow(targetPoint) {
    this._x = this.x.getValue()
    this._y = this.y.getValue()

    this.x.follow(targetPoint.x);
    this.y.follow(targetPoint.y);

    const point = this.getPoint();

    this.velocity = dist(point.x, point.y, this._x, this._y)

    return point
  }

  getPoint() {
    return {
      x: this.x.getValue(),
      y: this.y.getValue(),
    };
  }
}

export class SmoothValue {
  constructor(options = {}) {
    const defaults = {
      value: 0,
      smooth: 0.05,
    };
    Object.assign(this, defaults, options);
  }

  follow(value) {
    this.value = lerp(this.value, value || 0, this.smooth);
  }

  getValue() {
    return this.value;
  }
}

export class SmoothDampValue {
  constructor(options = {}) {
    this.params = {
      value: 0,
      smoothness: 1,
      maxSpeed: Infinity,
      ...options,
    }

    this.velocity = 0
    this.value = this.params.value
  }

  setTarget(target) {
    this.target = target
  }

  update(deltaTime) {
    this.value = this.smoothDamp(this.value, this.target, deltaTime)
    return this.value
  }

  valueOf() {
    return this.value
  }

  smoothDamp(
    current,
    target,
    deltaTime
  ) {
    const { smoothness, maxSpeed } = this.params
    let num = 2 / (smoothness || 0.00001);
    let num2 = num * deltaTime;
    let num3 = 1 / (1 + num2 + 0.48 * num2 * num2 + 0.235 * num2 * num2 * num2);
    let num4 = current - target;
    let num5 = target;
    let num6 = maxSpeed * smoothness;
    num4 = constrain(num4, -num6, num6);
    target = current - num4;
    let num7 = (this.velocity + num * num4) * deltaTime;
    this.velocity = (this.velocity - num * num7) * num3;
    let num8 = target + (num4 + num7) * num3;
    if (num5 - current > 0 === num8 > num5) {
      num8 = num5;
      this.velocity = (num8 - num5) / deltaTime;
    }
    return num8;
  }
}