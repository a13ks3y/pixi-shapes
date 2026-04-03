export class ShapeModel {
  private vy: number;
  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    public color: number | string,
    public angle: number,
    public shapeType: number,
  ) {
    if (!this.h) this.h = this.w;
    this.vy = 0;
  }
  update(
    gravity: number,
    screenHeight: number,
    bounds: { maxY: number },
    deltaTime: number,
  ) {
    if (Math.floor(bounds.maxY) < screenHeight) {
      this.vy += (gravity * deltaTime) / 100;
      this.y += this.vy;
    }
  }
}
