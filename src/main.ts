import { Application } from "pixi.js";
import { Graphics } from 'pixi.js';
enum ShapeType {
  RECT,
  CIRCLE,
  TRIANGLE,
  HEXAGONE,
  OVAL
}

const MAX_SHAPES_COUNT = 1000;
const shapes: Graphics[] = [];

let gravity = 0.98;


function generateRandomShape(shapeType:number, w:number, h:number, color:number|string) {
    const x = 0, y = 0;
    let shape;
    const randomAngle = (Math.random() * 360) * (Math.PI / 180);
    switch(shapeType) {
      case ShapeType.RECT: shape = new Graphics()
        .rotateTransform(randomAngle)
        .rect(x, y, w, h).fill(color); 
        break;
      case ShapeType.CIRCLE: shape = new Graphics()
        .circle(x, y, w)
        .fill(color);
        break;
      case ShapeType.TRIANGLE: 
        shape = new Graphics()
          .rotateTransform(randomAngle)
          .moveTo(x, y)
          .lineTo(x+w, y)
          .lineTo(x, y+h)
          .lineTo(x, y)
          .fill(color); 
        break;
      case ShapeType.HEXAGONE: {
        const r = Math.min(w, h) / 2;
        const cx = x + r;
        const cy = y + r;
        const sides = 6;
        const angleStep = (Math.PI * 2) / sides;
        const g = new Graphics();
        g.rotateTransform(randomAngle);
        g.moveTo(
          cx + r * Math.cos(0),
          cy + r * Math.sin(0)
        );
        for (let j = 1; j < sides; j++) {
          g.lineTo(
        cx + r * Math.cos(j * angleStep),
        cy + r * Math.sin(j * angleStep)
          );
        }
        shape = g.closePath().fill(color);
        break;
      }
      case ShapeType.OVAL: shape = new Graphics()
        .rotateTransform(randomAngle)
        .ellipse(x, y, w, h)
        .fill(color);
        break;
      default: shape = new Graphics().rect(x, y, w, h).fill(color);
    }
    const rect = shape.getBounds();
    const area = rect.width * rect.height; // lol
    shape["area"] = area; // @hack @todo fix it
    return shape;
}


function generateShapes(app: Application, count: number) {
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random()*app.screen.width);
    const y = -app.screen.height;
    const w = Math.floor(Math.random()*64)+28; 
    const h = Math.floor(Math.random()*64)+28;
    const color = Math.floor(Math.random() * 0xFFFFFF);
    const shapeType = Math.floor(Math.random() * 6);
    const shape = generateRandomShape(shapeType, w, h, color);
    shape.position.set(x, y);
    shape.interactive = true;
    shape.on('click', () => {
      app.stage.removeChild(shape);
      const index = shapes.indexOf(shape);
      if (index !== -1) {
        shapes.splice(index, 1);
      }
    });
    app.stage.addChild(shape);

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
    gravity = Number(gravityEl.value);
    shapeCountEl.innerText = shapes.length.toString(10);
    const totalArea = shapes.reduce((p, c) => Number(c["area"]) + p, 0);
    shapeAreaEl.innerText = totalArea.toFixed(2);
    // Get shapes per second from the range input
    const shapesPerSecond = Number(generationRangeEl.value);
    generationRangeTextEl.innerText = shapesPerSecond.toString(10);
    gravityTextEl.innerText = gravity.toString(10);

    spawnAccumulator += shapesPerSecond * time.deltaMS / 1000//* deltaSec;
    if (spawnAccumulator > 1) {
      generateShapes(app, Math.floor(spawnAccumulator));
      spawnAccumulator = 0;
    }

    shapes.forEach(shape => {
      if (Math.floor(shape.y + shape.height) < app.screen.height) {
        shape.position.set(shape.x, shape.y + gravity * app.ticker.deltaTime);
      }
    });
    if (shapes.length >= MAX_SHAPES_COUNT) {
      for (let i = 0; i < Math.floor(shapes.length / 2); i++) {
        const shape = shapes.shift();
        if (shape) {
          app.stage.removeChild(shape);
        }
      }
    }
  });
})();
