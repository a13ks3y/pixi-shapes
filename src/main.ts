import { Application } from "pixi.js";
import { ShapeController } from "./shape.controller";
import { ShapeModel } from "./shape.model";

const MAX_SHAPES_COUNT = 50;
let shapes: ShapeController[] = [];
let gravity = 0.98;


function generateShapes(app: Application, count: number) {
  for (let i = 0; i < count; i++) {
    const shapeModel = new ShapeModel(
      Math.floor(Math.random()*app.screen.width),
      -app.screen.height,
      Math.floor(Math.random()*64)+28, 
      Math.floor(Math.random()*64)+28,
      Math.floor(Math.random() * 0xFFFFFF),
      (Math.random() * 360) * (Math.PI / 180),
      Math.floor(Math.random()*6)
    );
    const shape = new ShapeController(app.stage, shapeModel);
    shapes.push(shape);
  }
}


(async () => {
  const app = new Application();
  await app.init({ background: "#123312", resizeTo: document.getElementsByTagName('main')[0] });
  document.getElementById("pixi-container")!.appendChild(app.canvas);
  const gravityEl: HTMLInputElement = document.getElementById('gravity') as HTMLInputElement;
  const generationRangeEl: HTMLInputElement = document.getElementById('generation-rate') as HTMLInputElement;
  const generationRangeTextEl: HTMLElement = document.getElementById('generation-rate-text') as HTMLElement;
  const gravityTextEl: HTMLElement = document.getElementById('gravity-text') as HTMLElement;
  const shapeCountEl: HTMLElement = document.getElementById('shapes-count') as HTMLElement;
  const shapeAreaEl: HTMLElement = document.getElementById('shapes-area') as HTMLElement;
  let spawnAccumulator = 0;

  app.ticker.add((time) => {
    shapes = shapes.filter(shape => !shape.isDisposed);
    gravity = Number(gravityEl.value);
    shapeCountEl.innerText = shapes.length.toString(10);
    const totalArea = shapes.reduce((p, c) => Number(c["area"]) + p, 0);
    shapeAreaEl.innerText = totalArea.toFixed(2);
    const shapesPerSecond = Number(generationRangeEl.value);
    generationRangeTextEl.innerText = shapesPerSecond.toString(10);
    gravityTextEl.innerText = gravity.toString(10);

    spawnAccumulator += shapesPerSecond * time.deltaMS / 1000//* deltaSec;
    if (spawnAccumulator > 1) {
      generateShapes(app, Math.floor(spawnAccumulator));
      spawnAccumulator = 0;
    }

    shapes.forEach(shape => {
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
