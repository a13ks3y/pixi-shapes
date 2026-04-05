import { Graphics } from "pixi.js";

export enum ShapeType {
  CIRCLE,
  TRIANGLE,
  RECT,
  HEXAGONE,
  ELLIPSE,
  CLOUD,
}
export interface IShapeView {
  draw(
    g: Graphics,
    w: number,
    h: number,
    color: number | string,
    angle: number,
  ): number;
}
export const ShapeViews: Record<ShapeType, IShapeView> = {
  [ShapeType.CIRCLE]: {
    draw: (
      g: Graphics,
      w: number,
      h: number,
      color: number | string,
    ): number => {
      const r = Math.max(w, h);
      g.circle(0, 0, r).fill(color);
      return Math.PI * r ** 2;
    },
  },
  [ShapeType.TRIANGLE]: {
    draw: (
      g: Graphics,
      w: number,
      h: number,
      color: number | string,
      angle: number,
    ): number => {
      g.pivot.set(w / 2, h / 2);
      g.rotateTransform(angle)
        .moveTo(0, 0)
        .lineTo(0 + w, 0)
        .lineTo(0, 0 + h)
        .lineTo(0, 0)
        .fill(color);
      return (w * h) / 2;
    },
  },
  [ShapeType.RECT]: {
    draw: (
      g: Graphics,
      w: number,
      h: number,
      color: number | string,
      angle: number,
    ): number => {
      g.pivot.set(w / 2, h / 2);
      g.rotateTransform(angle).rect(0, 0, w, h).fill(color);
      return w * h;
    },
  },
  [ShapeType.HEXAGONE]: {
    draw: (
      g: Graphics,
      w: number,
      h: number,
      color: number | string,
      angle: number,
    ): number => {
      const r = Math.min(w, h) / 2;
      const cx = 0 + r;
      const cy = 0 + r;
      const sides = 6;
      const angleStep = (Math.PI * 2) / sides;
      g.pivot.set(r / 2, r / 2);
      g.rotateTransform(angle);
      g.moveTo(cx + r * Math.cos(0), cy + r * Math.sin(0));
      for (let j = 1; j < sides; j++) {
        g.lineTo(
          cx + r * Math.cos(j * angleStep),
          cy + r * Math.sin(j * angleStep),
        );
      }
      g.closePath().fill(color);

      return ((3 * Math.sqrt(3)) / 2) * r ** 2;
    },
  },
  [ShapeType.ELLIPSE]: {
    draw: (
      g: Graphics,
      w: number,
      h: number,
      color: number | string,
      angle: number,
    ): number => {
      g.rotateTransform(angle).ellipse(0, 0, w, h).fill(color);
      return Math.PI * w * h;
    },
  },
  [ShapeType.CLOUD]: {
    draw: (
      g: Graphics,
      w: number,
      h: number,
      color: number | string,
      angle: number,
    ): number => {
      const circles = Math.max(Math.floor(angle / 10), 3);
      const radius = Math.floor((w + h) / 6);
      const centerX = w / 2;
      const centerY = h / 2;
      for (let i = 0; i < circles; i++) {
        const r = Math.floor(Math.random() * radius) + radius / 2;
        const angle = (i / circles) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * (r * 0.8);
        const y = centerY + Math.sin(angle) * (r * 0.6);
        g.circle(x, y, r);
      }

      g.fill(color);

      return Math.PI * (w / 2) * (h / 2);
    },
  },
};
