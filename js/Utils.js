export default class Utils {
  constructor() {}
  static loadJSON(url) {
    return fetch(url)
      .then((data) => data.json())
      .then((json) => json);
  }
}
