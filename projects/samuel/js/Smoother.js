class SmoothPoint {
  constructor(options = {}) {
    const defaults = {
      x: 0,
      y: 0,
      smooth: 0.05,
    };
    Object.assign(this, defaults, options);

    this.x = new SmoothValue({ value: this.x, smooth: this.smooth });
    this.y = new SmoothValue({ value: this.y, smooth: this.smooth });
  }

  follow(targetPoint) {
    this.x.follow(targetPoint.x);
    this.y.follow(targetPoint.y);
    return this.getPoint();
  }

  getPoint() {
    return {
      x: this.x.getValue(),
      y: this.y.getValue(),
    };
  }
}

class SmoothValue {
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
