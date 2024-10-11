import { getCanvasDimensions } from "../Canvas/helper/canvas-dimensions";
import { Render } from "../Scene";
import { create } from "zustand";
import { Dimensions } from "../Text/helpers/math/coordinates";

export const useAnimationState = create<{
  finished: boolean;
  forceEnd: boolean;
}>(() => ({
  finished: false,
  forceEnd: false,
}));

export const useImageLoaded = create<{ imageLoaded: boolean }>((set) => ({
  imageLoaded: false,
}));

type FitterProps = {
  carDimensions: Dimensions;
  canvasDimensions: Dimensions;
};
export const fitCarInsideCanvas = ({
  canvasDimensions,
  carDimensions,
}: FitterProps) => {
  const widthRatio = canvasDimensions.width / carDimensions.width;
  const heightRatio = canvasDimensions.height / carDimensions.height;
  const ratio = Math.min(widthRatio, heightRatio);

  return {
    carDestinationWidth: carDimensions.width * ratio,
    carDestinationHeight: carDimensions.height * ratio,
  };
};

class Car {
  position: number = -300;
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

      useImageLoaded.setState(() => ({ imageLoaded: true }));

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

    const { carDestinationHeight, carDestinationWidth } = fitCarInsideCanvas({
      canvasDimensions: getCanvasDimensions(this.canvas),
      carDimensions: this.image,
    });

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
      getCanvasDimensions(this.canvas).height - carDestinationHeight,

      // destination width - this is the computed width that will help fit the image on the canvas.
      carDestinationWidth,

      // destination height
      carDestinationHeight
    );
  }

  update() {
    if (this.ended) {
      console.error("YOU SHOULDN'T UPDATE AFTER END WAS TRIGGERED");
      return;
    }
    if (!this.canvas || !this.context || !this.car) return;

    if (this.car.position <= getCanvasDimensions(this.canvas).width + window.innerWidth) {
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
