import { Render } from "../Scene";

class Car {
  position: number;
  flipX: -1 | 1;
  velocity: number;
  width: number;
  constructor(width: number) {
    this.position = 0;
    this.velocity = 4;
    this.flipX = this.velocity > 0 ? 1 : -1;
    this.width = width;
  }
  update() {
    this.position += this.velocity;
  }
  timeout() {
    this.velocity = 0;
  }
  restart(screenWidth: number) {
    const random = Math.random();
    setTimeout(() => {
      this.velocity = random > 0.5 ? 5 : 10;
      this.flipX = random > 0.5 ? 1 : -1;
      this.position = 0 - screenWidth;
    }, random * 2000);
  }
}

export default class CarRender implements Render {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  restart: boolean;
  car: Car;
  image: HTMLImageElement;
  blur: boolean;
  constructor(
    canvas: HTMLCanvasElement,
    carWidth: number,
    image: HTMLImageElement,
    context: CanvasRenderingContext2D
  ) {
    this.canvas = canvas;
    this.image = image;
    this.restart = false;
    this.context = context;
    this.car = new Car(carWidth);
    this.blur = false;
  }

  update() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (
      (this.car.velocity > 0 && this.car.position <= this.car.width) ||
      (this.car.velocity < 0 && this.car.position >= 0)
    ) {
      this.restart = false;
      this.car.update();
    } else {
      this.car.timeout();
      !this.restart
        ? (this.car.restart(this.canvas.width), (this.restart = true))
        : ((this.restart = true), (this.blur = true));
    }
  }

  render() {
    this.context.globalCompositeOperation = "source-over";
    this.context.save();
    this.context.scale(this.car.flipX, 1);
    this.car.velocity
      ? this.context.drawImage(
          this.image,
          // sx
          0,

          // sy
          0,

          // sw
          this.image.width,

          // sh
          this.image.height,

          // dx
          -this.canvas.width + this.car.position,

          // dy
          this.canvas.height / 2 - ((6 / 10) * this.canvas.height) / 2,

          // dw - this is the computed width that will help with fitting the image on the canvas. The 200px offset
          // is used to scale the image down even further as to not touch the borders of the canvas.
          (this.image.width * ((6 / 10) * this.canvas.height)) /
            this.image.height,

          // dh
          (6 / 10) * this.canvas.height
        )
      : 0;
    this.context.restore();
  }
}
