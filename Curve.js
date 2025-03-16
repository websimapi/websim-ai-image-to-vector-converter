import Point from './Point.js';

export default class Curve {
  constructor(n) {
    this.n = n;
    this.tag = new Array(n);
    this.c = new Array(n * 3);
    this.alphacurve = 0;
    this.vertex = new Array(n);
    this.alpha = new Array(n);
    this.alpha0 = new Array(n);
    this.beta = new Array(n);

    for (let i = 0; i < n; i++) {
      this.tag[i] = "CURVE";
      this.c[i * 3 + 0] = new Point();
      this.c[i * 3 + 1] = new Point();
      this.c[i * 3 + 2] = new Point();
      this.vertex[i] = new Point();
      this.alpha[i] = 0;
      this.alpha0[i] = 0;
      this.beta[i] = 0;
    }
  }
}

