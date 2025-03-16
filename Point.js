export default class Point {
  constructor(x, y) {
    this.x = x !== undefined ? x : 0;
    this.y = y !== undefined ? y : 0;
  }

  copy() {
    return new Point(this.x, this.y);
  }

  lerp(p, t) {
    const res = new Point();
    res.x = this.x + (p.x - this.x) * t;
    res.y = this.y + (p.y - this.y) * t;
    return res;
  }

  ddenom(p2) {
    return this.x * p2.y - p2.x * this.y;
  }
}

