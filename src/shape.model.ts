import { ShapeType } from "./shape.view";

export class ShapeModel {
  private vy: number;
  public constructor(
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
  update(gravity: number, shapeHeight: number, screenHeight: number, deltaTime: number) {
    const maxY = this.y +  shapeHeight;
    if (Math.floor(maxY) < screenHeight) {
      this.vy += gravity * deltaTime;
    } else {
      this.vy = 0;
    }
    this.y += (this.vy * deltaTime) / 100; // Adjusted for nice looking number of gravity. 
  }
  // While it seems to be a good idea to have a method for calculating area in the view, as view knows how to draw itself, but it is not views job to calculate the area, it is models job, as it is the one who has all the data to calculate area, and if we will add new shape, we will need to add method for calculating area in the model anyway, so it is better to have it in one place. 
  get area(): number {
    return this.w * this.h;  
  }

  static createShape(shapeType: number, options: Partial<ShapeModel>): ShapeModel {
    switch (shapeType) {
      case ShapeType.RECT:
        return new RectModel(
          options.x || 0,
          options.y || 0,
          options.w || 0,
          options.h || 0,
          options.color || 0,
          options.angle || 0,
          shapeType,
        );
      case ShapeType.TRIANGLE:
        return new TriangleModel(
          options.x || 0,
          options.y || 0,
          options.w || 0,
          options.h || 0,
          options.color || 0,
          options.angle || 0,
          shapeType,
        );
      case ShapeType.CIRCLE:
        return new CircleModel(
          options.x || 0,
          options.y || 0,
          options.w || 0,
          options.h || 0,
          options.color || 0,
          options.angle || 0,
          shapeType,
        );
      case ShapeType.HEXAGONE:
        return new HexagoneModel(
          options.x || 0,
          options.y || 0,
          options.w || 0,
          options.h || 0,
          options.color || 0,
          options.angle || 0,
          shapeType,
        );
      case ShapeType.ELLIPSE:
        return new EllipseModel(
          options.x || 0,
          options.y || 0,
          options.w || 0,
          options.h || 0,
          options.color || 0,
          options.angle || 0,
          shapeType,
        );
      case ShapeType.CLOUD:
        return new CloudModel(
          options.x || 0,
          options.y || 0,
          options.w || 0,
          options.h || 0,
          options.color || 0,
          options.angle || 0,
          shapeType,
        );
      default:
        return new ShapeModel(
          options.x || 0,
          options.y || 0,
          options.w || 0,
          options.h || 0,
          options.color || 0,
          options.angle || 0,
          shapeType,
        );
    }
  }
}

class RectModel extends ShapeModel {
  get area(): number {
    return this.w * this.h;
  }
}

class TriangleModel extends ShapeModel {
  get area(): number {
    return (this.w * this.h) / 2;
  }
}
class CircleModel extends ShapeModel {
  get area(): number {
    const r = Math.max(this.w, this.h);
    return Math.PI * r ** 2;
  }
}

class HexagoneModel extends ShapeModel {
  get area(): number {
    const r = Math.min(this.w, this.h);
    return (3 * Math.sqrt(3) * r ** 2) / 2;
  }
}

class EllipseModel extends ShapeModel {
  get area(): number {
    return Math.PI * this.w * this.h;
  }
}

class CloudModel extends ShapeModel {
  get area(): number {
    const r = Math.min(this.w, this.h);
    // @todo replace approximation with real calculation 
    return Math.PI * r ** 2;
  }
}
