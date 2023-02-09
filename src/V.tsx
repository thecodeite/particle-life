export class V {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    if (Number.isNaN(x) || Number.isNaN(y)) {
      console.trace("Got NaN");
      throw new Error("NaN");
    }
    this.x = x;
    this.y = y;
  }

  diff(v2: V) {
    return new V(this.x - v2.x, this.y - v2.y);
  }

  diffWrap(v2: V, width: number, height: number) {
    let dx = this.x - v2.x;
    if (dx > width / 2) dx -= width;
    if (dx < -width / 2) dx += width;

    let dy = this.y - v2.y;
    if (dy > height / 2) dy -= height;
    if (dy < -height / 2) dy += height;

    return new V(dx, dy);
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  unit(length: number) {
    const l = length || this.length();
    if (l === 0) {
      return new V(0, 0);
    }
    return new V(this.x / l, this.y / l);
  }

  add(v: V) {
    return new V(this.x + v.x, this.y + v.y);
  }

  scale(c: number) {
    return new V(this.x * c, this.y * c);
  }

  limit(width: number, height: number) {
    const x = ((this.x % width) + width) % width;
    const y = ((this.y % height) + height) % height;
    return new V(x, y);
  }
}
