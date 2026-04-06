import { describe, it, expect } from "vitest";
import { ShapeModel } from "./shape.model";
import { ShapeType } from "./shape.view";

describe("ShapeModel class", () => {
  // @todo: move area unit tests here
  it("should create shape model with default values", () => {
    const shapeModel = new ShapeModel(0, 0, 0, 0, 0, 0, 0);
    expect(shapeModel.area).toBe(0);
  });
  it("factory also should create shape model with default values", () => {
    const shapeModel = ShapeModel.createShape(0, {});
    expect(shapeModel.area).toBe(0);
  });
  it("rect area should be width multiplied by height", () => {
    const shapeModel = ShapeModel.createShape(ShapeType.RECT, { w: 2, h: 3 });
    expect(shapeModel.area).toBe(6);
  });
  it("circle area should correct", () => {
    const shapeModel = ShapeModel.createShape(ShapeType.CIRCLE, { w: 2, h: 3 });
    expect(shapeModel.area.toFixed(2)).toBe("28.27");
  });
  it("triangle area should be half of a rect area", () => {
    const shapeModel = ShapeModel.createShape(ShapeType.TRIANGLE, {
      w: 2,
      h: 3,
    });
    expect(shapeModel.area).toBe(3);
  });
  it("hexagone area should be correct", () => {
    const shapeModel = ShapeModel.createShape(ShapeType.HEXAGONE, {
      w: 2,
      h: 3,
    });
    expect(~~shapeModel.area).toBe(10);
  });
  it("ellipse area should be correct", () => {
    const shapeModel = ShapeModel.createShape(ShapeType.ELLIPSE, {
      w: 2,
      h: 3,
    });
    expect(shapeModel.area.toFixed(2)).toBe("18.85");
  });
  it("cloud area should be correct", () => {
    const shapeModel = ShapeModel.createShape(ShapeType.CLOUD, { w: 2, h: 3 });
    expect(shapeModel.area.toFixed(2)).toBe("12.57");
  });
  it("update should increase y coordinate by gravity", () => {
    const shapeModel = ShapeModel.createShape(ShapeType.RECT, {});
    shapeModel.update(10, 0, 100, 24);
    expect(shapeModel.y).toBe(57.6);
  });
  it("update should increase y coordinate by gravity incrementaly", () => {
    const shapeModel = ShapeModel.createShape(ShapeType.RECT, {});
    shapeModel.update(10, 0, 100, 12);
    shapeModel.update(10, 0, 100, 12);
    expect(shapeModel.y).toBe(43.2);
  });
});
