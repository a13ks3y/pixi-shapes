import { Container } from "pixi.js";
import { ShapeType } from "./shape.view.ts";
import { ShapeController } from "./shape.controller.ts";
import { describe, it, expect, vi } from "vitest";
import { ShapeModel } from "./shape.model.ts";
describe("ShapeController class", () => {
  const stageMock: Container = {
    addChild: vi.fn(),
    removeChild: vi.fn(),
  } as unknown as Container;
  it("should calculate rectangle area", () => {
    const shape = new ShapeController(
      stageMock,
      new ShapeModel(0, 0, 2, 3, 0, 0, ShapeType.RECT as number),
    );
    expect(shape.area).toBe(6);
  });
  it("should calculate triangle area", () => {
    const shape = new ShapeController(
      stageMock,
      new ShapeModel(0, 0, 2, 3, 0, 0, ShapeType.TRIANGLE as number),
    );
    expect(shape.area).toBe(3);
  });
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
  it("should calculate hexagone area", () => {
    const shape = new ShapeController(
      stageMock,
      new ShapeModel(0, 0, 32, 32, 0, 0, ShapeType.HEXAGONE as number),
    );
    expect(shape.area.toFixed(2)).toBe("665.11");
  });
  it("dispose should call removeChild", () => {
    const shape = new ShapeController(
      stageMock,
      new ShapeModel(0, 0, 32, 32, 0, 0, ShapeType.HEXAGONE as number),
    );
    shape.dispose();
    expect(stageMock.removeChild).toHaveBeenCalledWith(shape["_graphics"]);
    expect(shape.isDisposed).toBeTruthy();
  });
});
