import { Render } from "../Scene";
import { create } from "zustand";

export const useAnimtationState = create<{ finished: boolean }>((set) => ({
  finished: false,
  finishAnimation: () => set(() => ({ finished: true })),
}));

export const INITIAL_CAR_VELOCITY = 4;
export const imageDisplayDimensions = (
  image: HTMLImageElement,
  canvasHeight: number
) => {
  const carDisplayHeight = (6 / 10) * canvasHeight;
  const carDisplayWidth = image.width * (carDisplayHeight / image.height);

  return { carDisplayHeight, carDisplayWidth };
};

class Car {
  position: number = 0;
  mirror: boolean = false;
  velocity: number = INITIAL_CAR_VELOCITY;
  width: number;
  constructor(width: number) {
    this.width = width;
  }
  update() {
    this.position += this.velocity;
  }

  timeout() {
    this.velocity = 0;
  }

  restart(screenWidth: number, carWidth: number) {
    const random = Math.random();
    useAnimtationState.setState({ finished: true });
    setTimeout(() => {
      this.mirror = random > 0.5 ? false : true;
      this.velocity = random > 0.5 ? 4 : 6;

      if (this.mirror) this.velocity = -this.velocity;

      if (this.mirror) this.position = screenWidth + carWidth;
      if (!this.mirror) this.position = 0 - screenWidth;
    }, random * 2000 + 2000);
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

  initializeCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  constructor(image: HTMLImageElement, mirroredImage: HTMLImageElement) {
    this.image = image;
    this.mirroredImage = mirroredImage;
    this.image.onload = () => {
      this.car = new Car(image.width);
      this.ready = true;
    };
  }

  update() {
    if (!this.canvas || !this.context || !this.ready || !this.car) return;

    let image = this.image;
    if (this.car.mirror) image = this.mirroredImage;

    const { carDisplayWidth } = imageDisplayDimensions(
      image,
      this.canvas.height
    );

    if (
      (this.car.velocity > 0 &&
        this.car.position <= this.canvas.width + carDisplayWidth) ||
      (this.car.velocity < 0 && this.car.position >= 0)
    ) {
      this.restart = false;
      this.car.update();
    } else {
      this.car.timeout();
      !this.restart
        ? (this.car.restart(this.canvas.width, carDisplayWidth),
          (this.restart = true))
        : (this.restart = true);
    }
  }

  render() {
    if (!this.canvas || !this.context || !this.ready || !this.car) return;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let image = this.image;
    if (this.car.mirror) image = this.mirroredImage;

    const { carDisplayWidth, carDisplayHeight } = imageDisplayDimensions(
      image,
      this.canvas.height
    );

    this.car.velocity
      ? this.context.drawImage(
          image,
          // sx
          0,

          // sy
          0,

          // sw
          image.width,

          // sh
          image.height,

          // dx
          -carDisplayWidth + this.car.position,

          // dy
          this.canvas.height / 1.75 - carDisplayHeight / 1.75,

          // dw - this is the computed width that will help fit the image on the canvas.
          carDisplayWidth,

          // dh
          carDisplayHeight
        )
      : 0;
  }
}
