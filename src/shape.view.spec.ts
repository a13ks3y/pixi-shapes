import { describe, it, expect, beforeEach } from "vitest";
import { ShapeType, ShapeViews } from "./shape.view";
import { Graphics } from "pixi.js";

describe("ShapeViews implementation", () => {
  let g: Graphics;
  beforeEach(() => {
    g = new Graphics();
  });
  it("should render cirlce and return correct area", () => {
    const view = ShapeViews[ShapeType.CIRCLE];
    const area = view.draw(g, 16, 0, 0, 0);
    expect(area.toFixed(2)).toEqual("50.27");
  });
  it("should render rect and return correct area", () => {
    const view = ShapeViews[ShapeType.RECT];
    const area = view.draw(g, 2, 3, 0, 0);
    expect(area.toFixed(2)).toEqual("6.00");
  });
  it("should render triangle and return correct area", () => {
    const view = ShapeViews[ShapeType.TRIANGLE];
    const area = view.draw(g, 2, 3, 0, 0);
    expect(area.toFixed(2)).toEqual("3.00");
  });
  it("should render hexagone and return correct area", () => {
    const view = ShapeViews[ShapeType.HEXAGONE];
    const area = view.draw(g, 16, 16, 0, 0);
    expect(area.toFixed(2)).toEqual("166.28");
  });
  it("should render oval and return correct area", () => {
    const view = ShapeViews[ShapeType.ELLIPSE];
    const area = view.draw(g, 16, 16, 0, 0);
    expect(area.toFixed(2)).toEqual("804.25");
  });
});
