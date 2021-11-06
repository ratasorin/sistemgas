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
      this.velocity = random > 0.5 ? random * 10 : -(random * 10);
      this.flipX = this.velocity > 0 ? 1 : -1;
      this.position =
        this.flipX === 1 ? 0 - this.width : screenWidth + this.width;
    }, random * 2000);
  }
}

export class CarRender {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  restart: boolean;
  car: Car;
  image: HTMLImageElement;
  constructor(
    canvas: HTMLCanvasElement,
    carWidth: number,
    image: HTMLImageElement
  ) {
    this.canvas = canvas;
    this.image = image;
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.restart = false;
    this.car = new Car(carWidth);
  }

  update() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (
      (this.car.velocity > 0 && this.car.position <= this.canvas.width) ||
      (this.car.velocity < 0 && this.car.position >= 0)
    ) {
      this.restart = false;
      this.car.update();
    } else {
      this.car.timeout();
      !this.restart
        ? this.car.restart(this.canvas.width)
        : (this.restart = true);
    }
  }

  render() {
    this.context.globalCompositeOperation = "source-over";
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
          0,

          // dw - this is the computed width that will help with fitting the image on the canvas
          (this.image.width * this.canvas.height) / this.image.height,

          // dh
          this.canvas.height
        )
      : 0;
  }
}
