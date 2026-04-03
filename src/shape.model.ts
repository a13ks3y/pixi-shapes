export class ShapeModel {
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
  }
  update(
    gravity: number,
    screenHeight: number,
    bounds: { height: number },
    deltaTime: number,
  ) {
    if (
      Math.floor(this.y + bounds.height - bounds.height * 0.2) < screenHeight
    ) {
      this.y += gravity * deltaTime;
    }
  }
}
