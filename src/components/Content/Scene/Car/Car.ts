import { getCanvasDimensions } from "../Canvas/helper/canvas-dimensions";
import { Render } from "../Scene";
import { create } from "zustand";

export const useAnimationState = create<{
  finished: boolean;
  forceEnd: boolean;
}>((set) => ({
  finished: false,
  forceEnd: false,
  finishAnimation: () => set((s) => ({ ...s, finished: true })),
  forceEndAnimation: () => set((s) => ({ ...s, forceEnd: true })),
}));

export const imageDisplayDimensions = (
  image: HTMLImageElement,
  canvasHeight: number,
  heightFactor: number
) => {
  const carDisplayHeight = heightFactor * canvasHeight;
  const carDisplayWidth = image.width * (carDisplayHeight / image.height);

  return { carDisplayHeight, carDisplayWidth };
};

class Car {
  position: number = 0;
  velocity: number = 0;
  width: number;
  constructor(width: number, velocity: number) {
    this.width = width;
    this.velocity = velocity;
  }
  update() {
    this.position += this.velocity;
  }
}

export default class CarRender implements Render {
  canvas: HTMLCanvasElement | undefined;
  context: CanvasRenderingContext2D | undefined;
  car: Car | undefined;
  image: HTMLImageElement;
  heightFactor: number = 0;
  carVelocity: number = 0;
  ended: boolean = false;

  get scaleCoefficient() {
    if (!this.canvas) return 1;

    const CSS_SCALE = 0.9;
    const { carDisplayWidth } = imageDisplayDimensions(
      this.image,
      getCanvasDimensions(this.canvas).height,
      this.heightFactor
    );

    return (
      carDisplayWidth / (getCanvasDimensions(this.canvas).width * CSS_SCALE)
    );
  }

  initializeCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
    // Scale the context to ensure correct drawing operations
    // Set actual size in memory (scaled to account for extra pixel density).
    this.canvas.width = Math.floor(
      Number(canvas.style.width.replace("px", "")) * 3
    );
    this.canvas.height = Math.floor(
      Number(canvas.style.height.replace("px", "")) * 3
    );

    this.context.scale(3, 3);

    this.drawCar();
    this.render();
  }

  constructor(image: HTMLImageElement, velocity: number, heightFactor: number) {
    this.image = image;
    this.heightFactor = heightFactor;
    this.carVelocity = velocity;
    this.car = new Car(this.image.width, this.carVelocity);

    this.image.onload = () => {
      this.car = new Car(this.image.width, this.carVelocity);

      this.drawCar();
      this.render();
    };
  }

  end() {
    if (!this.context || !this.canvas) {
      this.ended = true;
      return;
    }
    this.ended = true;
    this.context.clearRect(
      0,
      0,
      getCanvasDimensions(this.canvas).width,
      getCanvasDimensions(this.canvas).height
    );
  }

  drawCar() {
    if (this.ended) {
      console.error("YOU SHOULDN'T UPDATE AFTER END WAS TRIGGERED");
      return;
    }
    if (!this.context || !this.canvas) {
      console.error("THE CANVAS WAS NOT LOADED PROPERLY!");
      return;
    }

    if (!this.image || !this.car) {
      console.error("THE IMAGE WAS NOT LOADED PROPERLY!");
      return;
    }

    this.context.clearRect(
      0,
      0,
      getCanvasDimensions(this.canvas).width,
      getCanvasDimensions(this.canvas).height
    );

    this.context.drawImage(
      this.image,
      // source start X
      0,

      // source start Y
      0,

      // source width
      Math.floor(this.image.width),

      // source height
      Math.floor(this.image.height),

      // destination start X
      0,

      // destination start Y
      getCanvasDimensions(this.canvas).height -
        (Math.floor(getCanvasDimensions(this.canvas).width) /
          Math.floor(this.image.width)) *
          Math.floor(this.image.height),

      // destination width - this is the computed width that will help fit the image on the canvas.
      Math.floor(getCanvasDimensions(this.canvas).width),

      // destination height
      (Math.floor(getCanvasDimensions(this.canvas).width) /
        Math.floor(this.image.width)) *
        Math.floor(this.image.height)
    );

    // the transform origin is set on bottom right so that the scaling factor doesn't break the 1:1 relationship
    // between where the car is rendered and where the business logic perceives it to be
    this.canvas.style.transformOrigin = `100% 100%`;
    this.canvas.style.transform = `translateY(-${Math.floor(
      getCanvasDimensions(this.canvas).height / 20
    )}px) scale(${this.scaleCoefficient})`;
  }

  update() {
    if (this.ended) {
      console.error("YOU SHOULDN'T UPDATE AFTER END WAS TRIGGERED");
      return;
    }
    if (!this.canvas || !this.context || !this.car) return;

    if (
      this.car.position <=
      (1 + this.scaleCoefficient) * getCanvasDimensions(this.canvas).width
    ) {
      this.car.update();
    } else {
      useAnimationState.setState(() => ({ finished: true }));
      this.end();
    }
  }

  render() {
    if (!this.canvas || !this.car) return;

    const otherTransforms = this.canvas.style.transform.replace(
      /translateX\([^)]+\)\s*/g,
      ""
    );

    this.canvas.style.transform = `translateX(${
      -getCanvasDimensions(this.canvas).width + this.car.position
    }px) ${otherTransforms}`;
  }
}
