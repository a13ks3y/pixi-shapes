import { Graphics, Container } from "pixi.js";
import { IShapeView, ShapeType, ShapeViews } from "./shape.view";
import { ShapeModel } from "./shape.model";

export class ShapeController {
  private _graphics: Graphics;
  private _stage: Container;
  private _view: IShapeView;
  private _model: ShapeModel;
  public isDisposed: boolean = false;
  public area: number = 0;
  constructor(stage: Container, shapeModel: ShapeModel) {
    this._model = shapeModel;
    this._stage = stage;
    this._graphics = new Graphics();

    this._view = ShapeViews[this._model.shapeType as ShapeType];
    this.area = this._view.draw(
      this._graphics,
      this._model.w,
      this._model.h,
      this._model.color,
      this._model.angle,
    );
    this._graphics.interactive = true;
    this._graphics.on("click", this.dispose.bind(this));
    this._graphics.on("touch", this.dispose.bind(this));
    this._stage.addChild(this._graphics);
    this.move(this._model.x, this._model.y);
  }
  move(x: number, y: number) {
    this._model.x = x;
    this._model.y = y;
    this._graphics.position.set(x, y);
  }
  update(screenHeight: number, gravity: number, deltaTime: number) {
    this._model.update(
      gravity,
      screenHeight,
      this._graphics.getBounds(),
      deltaTime,
    );
    this.move(this._model.x, this._model.y);
  }
  dispose() {
    this._stage.removeChild(this._graphics);
    this.isDisposed = true;
  }
}
