const NO_TIMEOUT = null

export default class Countdown {
  constructor(durationMS) {
    this.duration = durationMS
    this.clear()
  }
  clear() {
    clearTimeout(this.timeout)
    this.timeout = NO_TIMEOUT
  }
  start(callback) {
    this.clear()
    this.timeout = setTimeout(callback, this.duration)
  }
  started() {
    return this.timeout !== NO_TIMEOUT
  }
}