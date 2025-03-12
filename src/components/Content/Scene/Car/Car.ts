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
  position: number = 0;
  velocity: number = 0;
  width: number;
  constructor(width: number, velocity: number) {
    this.width = width;
    this.velocity = velocity;
    this.position = -200;
  }
  update() {
    this.position += this.velocity;
  }
}

export default class CarRender {
  carElement: HTMLElement | undefined;
  context: CanvasRenderingContext2D | undefined;
  car: Car | undefined;
  carVelocity: number = 0;
  ended: boolean = false;

  constructor(carElement: HTMLElement, velocity: number) {
    this.carElement = carElement;
    this.carVelocity = velocity;
    this.car = new Car(carElement.clientWidth, this.carVelocity);
  }

  start() {
    this.car = new Car(this.carElement?.clientWidth || 0, this.carVelocity);
    useImageLoaded.setState(() => ({ imageLoaded: true }));
    this.render();
  }

  end() {
    if (!this.carElement) {
      this.ended = true;
      return;
    }
    this.ended = true;
  }

  remove() {
    if (!this.carElement) return;
    this.carElement.style.transform = `translateX(-100%)`;
  }

  update() {
    if (this.ended) {
      console.error("YOU SHOULDN'T UPDATE AFTER END WAS TRIGGERED");
      return 0;
    }
    if (!this.carElement || !this.car) return 0;

    if (
      this.car.position <=
      this.carElement.getBoundingClientRect().width + window.innerWidth
    ) {
      this.car.update();
    } else {
      useAnimationState.setState(() => ({ finished: true }));
      this.end();
    }

    return this.car.position;
  }

  render() {
    if (!this.carElement || !this.car) return;
    const otherTransforms = this.carElement.style.transform.replace(
      /translateX\([^)]+\)\s*/g,
      ""
    );

    this.carElement.style.transform = `translateX(${
      this.car.position
    }px) ${otherTransforms}`;
  }
}
