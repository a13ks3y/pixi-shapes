import { Application, Rectangle } from "pixi.js";
import { ShapeController } from "./shape.controller";
import { ShapeModel } from "./shape.model";
import { ShapeType } from "./shape.view";

const MAX_SHAPES_COUNT = 1000;
let shapes: ShapeController[] = [];

function generateRandomShapeAt(app: Application, x: number, y: number) {
  const shapeModel = new ShapeModel(
    x,
    y,
    Math.floor(Math.random() * 64) + 28,
    Math.floor(Math.random() * 64) + 28,
    Math.floor(Math.random() * 0xffffff),
    Math.random() * 360 * (Math.PI / 180),
    Math.floor(Math.random() * 6),
  );
  const shape = new ShapeController(app.stage, shapeModel);
  shapes.push(shape);
  shape.move(x, y);
  return shape;
}

function generateRandomShape(app: Application) {
  return generateRandomShapeAt(
    app,
    Math.floor(Math.random() * app.screen.width),
    0,
  );
}

function generateShapes(app: Application, count: number) {
  for (let i = 0; i < count; i++) {
    generateRandomShape(app);
  }
}

(async () => {
  const app = new Application();
  await app.init({
    background: "#123312",
    resizeTo: document.getElementsByTagName("main")[0],
  });
  document.getElementById("pixi-container")!.appendChild(app.canvas);
  const gravityEl: HTMLInputElement = document.getElementById(
    "gravity",
  ) as HTMLInputElement;
  const generationRangeEl: HTMLInputElement = document.getElementById(
    "generation-rate",
  ) as HTMLInputElement;
  const generationRangeTextEl: HTMLElement = document.getElementById(
    "generation-rate-text",
  ) as HTMLElement;
  const gravityTextEl: HTMLElement = document.getElementById(
    "gravity-text",
  ) as HTMLElement;
  const shapeCountEl: HTMLElement = document.getElementById(
    "shapes-count",
  ) as HTMLElement;
  const shapeAreaEl: HTMLElement = document.getElementById(
    "shapes-area",
  ) as HTMLElement;
  let spawnAccumulator = 0;

  app.stage.on("shapeTypeChanged", (shapeType: number) => {
    const filteredShapes = shapes.filter(
      (shape) => shape.shapeType === (shapeType as ShapeType),
    );
    const randomColor = Math.floor(Math.random() * 0xffffff);
    filteredShapes.forEach((shape) => shape.setColor(randomColor));
  });
  app.stage.hitArea = new Rectangle(0, 0, app.screen.width, app.screen.height);
  app.stage.interactive = true;
  app.stage.on("click", (e) => {
    if (e.target === app.stage) {
      generateRandomShapeAt(app, e.global.x, e.global.y);
    }
  });

  const gravityDecreaseBtn = document.getElementById("gravity-decrease");
  gravityDecreaseBtn?.addEventListener("click", () => {
    const gravity = Number(gravityEl.value);
    gravityEl.value = (gravity - 0.1).toString();
  });
  const gravityIncreaseBtn = document.getElementById("gravity-increase");
  gravityIncreaseBtn?.addEventListener("click", () => {
    const gravity = Number(gravityEl.value);
    gravityEl.value = (gravity + 0.1).toString();
  });
  const generationRateDecreaseBtn = document.getElementById(
    "generation-rate-decrease",
  );
  generationRateDecreaseBtn?.addEventListener("click", () => {
    const shapesPerSecond = Number(generationRangeEl.value);
    generationRangeEl.value = (shapesPerSecond - 1).toString();
  });
  const generationRateIncreaseBtn = document.getElementById(
    "generation-rate-increase",
  );
  generationRateIncreaseBtn?.addEventListener("click", () => {
    const shapesPerSecond = Number(generationRangeEl.value);
    generationRangeEl.value = (shapesPerSecond + 1).toString();
  });

  app.ticker.add((time) => {
    shapes = shapes.filter((shape) => !shape.isDisposed);
    const gravity = Number(gravityEl.value);
    shapeCountEl.innerText = shapes.length.toString(10);
    const totalArea = shapes.reduce((p, c) => Number(c["area"]) + p, 0);
    shapeAreaEl.innerText = totalArea.toFixed(2);
    const shapesPerSecond = Number(generationRangeEl.value);
    generationRangeTextEl.innerText = shapesPerSecond.toString(10);
    gravityTextEl.innerText = gravity.toFixed(2);

    spawnAccumulator += (shapesPerSecond * time.deltaMS) / 1000; //* deltaSec;
    if (spawnAccumulator > 1) {
      generateShapes(app, Math.floor(spawnAccumulator));
      spawnAccumulator = 0;
    }

    shapes.forEach((shape) => {
      shape.update(app.screen.height, gravity, time.deltaTime);
    });

    if (shapes.length >= MAX_SHAPES_COUNT) {
      for (let i = 0; i < Math.floor(shapes.length / 2); i++) {
        const shape = shapes.shift();
        if (shape) {
          shape.dispose();
        }
      }
    }
  });
})();
