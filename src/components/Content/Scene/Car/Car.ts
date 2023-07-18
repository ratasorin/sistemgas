import { Render } from "../Scene";


class Car {
  position: number;
  flipX: -1 | 1;
  velocity: number;
  width: number;
  constructor(width: number) {
    this.position = 0;
    this.velocity = 6;
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
  canvas: HTMLCanvasElement | undefined;
  context: CanvasRenderingContext2D | undefined;
  restart: boolean;
  car: Car;
  image: HTMLImageElement;
  ready: boolean = false;

  initializeCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  constructor(carWidth: number, image: HTMLImageElement) {
    this.image = image;
    this.restart = false;
    this.car = new Car(carWidth);
    this.image.onload = () => {
      this.ready = true;
    };
  }

  update() {
    if (!this.canvas || !this.context || !this.ready) return;

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
        : ((this.restart = true));
    }
  }

  render() {
    if (!this.canvas || !this.context || !this.ready) return;

    this.context.globalCompositeOperation = "source-over";
    this.context.save();
    this.context.scale(this.car.flipX, 1);

    const carDisplayHeight = (6 / 10) * this.canvas.height;
    const carDisplayWidth =
      this.image.width * (carDisplayHeight / this.image.height);

    console.log(this.canvas.height / 3 - carDisplayHeight / 3);
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
          -carDisplayWidth + this.car.position,

          // dy
          this.canvas.height / 1.75 - carDisplayHeight / 1.75,

          // dw - this is the computed width that will help fit the image on the canvas.
          carDisplayWidth,

          // dh
          carDisplayHeight
        )
      : 0;

    this.context.restore();
  }
}
