export function delay(millis) {
  return new Promise(resolve => setTimeout(resolve, millis))
}

export class Timer {
  constructor() {
    this.time = performance.now()
    this.startTime = 0;
  }

  stop() {
    this.startTime = 0;
    return { duration: this.duration }
  }

  now() {
    return performance.now()
  }

  get duration() {
    return this.now() - this.startTime
  }

  start() {
    const timeNow = this.now()
    this.startTime = timeNow
  }

  tick() {
    const timeNow = this.now()
    const deltaTime = timeNow - this.time
    this.time = timeNow

    return { duration: this.duration, deltaTime }
  }
}