import { getCanvasDimensions } from "../Canvas/helper/canvas-dimensions";
import { Render } from "../Scene";
import { create } from "zustand";

export const useAnimationState = create<{ finished: boolean }>((set) => ({
  finished: false,
  finishAnimation: () => set(() => ({ finished: true })),
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
  mirror: boolean = false;
  velocity: number = 0;
  width: number;
  constructor(width: number, velocity: number) {
    this.width = width;
    this.velocity = velocity;
  }
  update() {
    this.position += this.velocity;
  }

  timeout() {
    this.velocity = 0;
  }
}

export default class CarRender implements Render {
  canvas: HTMLCanvasElement | undefined;
  context: CanvasRenderingContext2D | undefined;
  restart: boolean = false;
  car: Car | undefined;
  image: HTMLImageElement;
  ready: boolean = false;
  mirroredImage: HTMLImageElement;
  heightFactor: number = 0;

  initializeCanvas(canvas: HTMLCanvasElement, dpr: number) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
    // Scale the context to ensure correct drawing operations
    // Set actual size in memory (scaled to account for extra pixel density).
    this.canvas.width = Math.floor(
      Number(canvas.style.width.replace("px", "")) * dpr
    );
    this.canvas.height = Math.floor(
      Number(canvas.style.height.replace("px", "")) * dpr
    );

    // Normalize coordinate system to use CSS pixels.
    this.context.scale(dpr, dpr);
  }

  constructor(
    image: HTMLImageElement,
    mirroredImage: HTMLImageElement,
    velocity: number,
    heightFactor: number
  ) {
    this.image = image;
    this.mirroredImage = mirroredImage;
    this.heightFactor = heightFactor;
    this.image.onload = () => {
      this.car = new Car(image.width, velocity);
      this.ready = true;
    };
  }

  update() {
    if (!this.canvas || !this.context || !this.ready || !this.car) return;

    let image = this.image;
    if (this.car.mirror) image = this.mirroredImage;

    const { carDisplayWidth } = imageDisplayDimensions(
      image,
      getCanvasDimensions(this.canvas).height,
      this.heightFactor
    );

    if (
      (this.car.velocity > 0 &&
        this.car.position <=
          getCanvasDimensions(this.canvas).width + carDisplayWidth) ||
      (this.car.velocity < 0 && this.car.position >= 0)
    )
      this.car.update();
    else useAnimationState.setState({ finished: true });
  }

  render() {
    if (!this.canvas || !this.context || !this.ready || !this.car) return;

    this.context.clearRect(
      0,
      0,
      getCanvasDimensions(this.canvas).width,
      getCanvasDimensions(this.canvas).height
    );

    let image = this.image;
    if (this.car.mirror) image = this.mirroredImage;

    const { carDisplayWidth, carDisplayHeight } = imageDisplayDimensions(
      image,
      getCanvasDimensions(this.canvas).height,
      this.heightFactor
    );

    if (!this.car.velocity) return;

    this.context.drawImage(
      image,
      // sx
      0,

      // sy
      0,

      // sw
      Math.floor(image.width),

      // sh
      Math.floor(image.height),

      // dx
      Math.floor(-carDisplayWidth + this.car.position),

      // dy
      Math.floor(
        getCanvasDimensions(this.canvas).height / (0.95 + this.heightFactor) -
          carDisplayHeight / (0.95 + this.heightFactor)
      ),

      // dw - this is the computed width that will help fit the image on the canvas.
      Math.floor(carDisplayWidth),

      // dh
      Math.floor(carDisplayHeight)
    );
  }
}
