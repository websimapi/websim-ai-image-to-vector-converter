export default class Quad {
  constructor() {
    this.data = [
      0, 0, 0,
      0, 0, 0,
      0, 0, 0
    ];
  }

  at(y, x) {
    return this.data[y * 3 + x];
  }
}

