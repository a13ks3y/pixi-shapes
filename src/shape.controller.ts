import { Graphics, Container } from "pixi.js";
import { IShapeView, ShapeType, ShapeViews } from "./shape.view";
import { ShapeModel } from "./shape.model";

export class ShapeController {
  //@todo: move _graphics to view
  private _graphics: Graphics;
  private _stage: Container;
  private _view: IShapeView;
  private _model: ShapeModel;
  public isDisposed: boolean = false;
  public get area(): number {
    return this._model.area;
  };
  public get shapeType(): ShapeType {
    return this._model.shapeType;
  }
  public setColor(color: number | string) {
    this._model.color = color;
    this._graphics.clear();
    this._view.draw(
      this._graphics,
      this._model.w,
      this._model.h,
      this._model.color,
      this._model.angle,
    );
  }
  constructor(stage: Container, shapeModel: ShapeModel) {
    this._model = shapeModel;
    this._stage = stage;
    this._graphics = new Graphics();

    this._view = ShapeViews[this._model.shapeType as ShapeType];
    this._view.draw(
      this._graphics,
      this._model.w,
      this._model.h,
      this._model.color,
      this._model.angle,
    );
    this._graphics.interactive = true;
    this._graphics.on("click", () => {
      this.clickHandler();
    });
    this._graphics.on("touch", () => {
      this.clickHandler();
    });
    this._stage.addChild(this._graphics);
    this.move(this._model.x, this._model.y);
  }
  move(x: number, y: number) {
    this._model.x = x;
    this._model.y = y;
    this._graphics.position.set(x, y);
  }
  update(screenHeight: number, gravity: number, deltaTime: number) {
    const shapeHeight = this._graphics.getBounds().height;
    this._model.update(gravity,  shapeHeight, screenHeight, deltaTime);
    this.move(this._model.x, this._model.y);
  }
  clickHandler() {
    this._stage.emit("shapeTypeChanged", this._model.shapeType);
    this.dispose();
  }
  dispose() {
    this._stage.removeChild(this._graphics);
    this._graphics.removeAllListeners();
    this._graphics.destroy();
    this.isDisposed = true;
  }
}
