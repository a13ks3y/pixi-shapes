import { Container, EventBoundary, FederatedPointerEvent } from "pixi.js";
import { ShapeType } from "./shape.view.ts";
import { ShapeController } from "./shape.controller.ts";
import { describe, it, expect, vi } from "vitest";
import { ShapeModel } from "./shape.model.ts";
describe("ShapeController class", () => {
  const stageMock: Container = {
    addChild: vi.fn(),
    removeChild: vi.fn(),
    emit: vi.fn(),
  } as unknown as Container;
  it("should move shape", () => {
    const graphicsMock = {
      position: {
        set: vi.fn(),
      },
    };
    const shape = new ShapeController(
      stageMock,
      new ShapeModel(0, 0, 2, 3, 0, 0, ShapeType.RECT as number),
    );
    //@ts-expect-error unit-testing
    shape["_graphics"] = graphicsMock;
    shape.move(5, 10);
    expect(graphicsMock.position.set).toHaveBeenCalledWith(5, 10);
  });
  it("dispose should call removeChild", () => {
    const shape = new ShapeController(
      stageMock,
      new ShapeModel(0, 0, 6, 6, 0, 0, ShapeType.HEXAGONE as number),
    );
    shape.dispose();
    expect(stageMock.removeChild).toHaveBeenCalledWith(shape["_graphics"]);
    expect(shape.isDisposed).toBeTruthy();
  });
  it("should call model update", () => {
    const shape = new ShapeController(
      stageMock,
      new ShapeModel(0, 0, 6, 6, 0, 0, ShapeType.RECT as number),
    );
    const modelUpdateSpy = vi.spyOn(shape["_model"], "update");
    shape.update(100, 9.8, 16);
    expect(modelUpdateSpy).toHaveBeenCalledWith(9.8, 6, 100, 16);
  });
  it("should update color and call draw on setColor", () => {
    const shape = new ShapeController(
      stageMock,
      ShapeModel.createShape(ShapeType.CIRCLE, { color: 0x654321 }),
    );
    shape["_view"].draw = vi.fn();
    shape.setColor(0x123456);
    expect(shape["_model"].color).toBe(0x123456);
    expect(shape["_view"].draw).toHaveBeenCalled();
  });
  //@todo actualy should delegate it to view
  it("should add click event listener to _graphics", () => {
    const shape = new ShapeController(stageMock, ShapeModel.createShape(0, {}));
    shape.clickHandler = vi.fn();
    const g: Container = shape["_graphics"] as Container;
    g.emit("click", new FederatedPointerEvent(new EventBoundary(g)));
    expect(shape.clickHandler).toHaveBeenCalled();
  });
  it("clickHandler should call dispose and emit custom event", () => {
    const shape = new ShapeController(stageMock, ShapeModel.createShape(3, {}));
    shape.dispose = vi.fn();
    shape.clickHandler();
    expect(shape.dispose).toHaveBeenCalled();
    expect(shape["_stage"].emit).toHaveBeenCalledWith("shapeTypeChanged", 3);
  });
});
