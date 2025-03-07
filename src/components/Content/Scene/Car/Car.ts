import { getElementDimensions } from "../Canvas/helper/element-dimensions";
import { create } from "zustand";

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

export default class CarRender {
  carElement: HTMLElement | undefined;
  context: CanvasRenderingContext2D | undefined;
  car: Car | undefined;
  heightFactor: number = 0;
  carVelocity: number = 0;
  ended: boolean = false;

  constructor(carElement: HTMLElement, velocity: number) {
    this.carElement = carElement;
    this.carVelocity = velocity;
    this.car = new Car(carElement.clientWidth, this.carVelocity);
  }

  start() {
    this.car = new Car(this.carElement?.clientWidth || 0, this.carVelocity);

    console.log("START?");

    useImageLoaded.setState(() => ({ imageLoaded: true }));

    this.render();
  }

  end() {
    if (!this.context || !this.carElement) {
      this.ended = true;
      return;
    }
    this.ended = true;
  }

  update() {
    if (this.ended) {
      console.error("YOU SHOULDN'T UPDATE AFTER END WAS TRIGGERED");
      return;
    }
    if (!this.carElement || !this.context || !this.car) return;

    if (
      this.car.position <=
      getElementDimensions(this.carElement).width + window.innerWidth
    ) {
      this.car.update();
    } else {
      useAnimationState.setState(() => ({ finished: true }));
      this.end();
    }
  }

  render() {
    if (!this.carElement || !this.car) return;
    const otherTransforms = this.carElement.style.transform.replace(
      /translateX\([^)]+\)\s*/g,
      ""
    );
    this.carElement.style.transform = `translateX(${
      -getElementDimensions(this.carElement).width + this.car.position
    }px) ${otherTransforms}`;
  }
}
