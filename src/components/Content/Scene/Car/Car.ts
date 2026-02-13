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
  update(deltaTime: number = 1) {
    this.position += this.velocity * deltaTime;
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

  skip() {
    if (this.car && this.carElement) {
      this.car.position = window.innerWidth + this.carElement.clientWidth + 2000;
      this.render();
    }
    this.end();
  }

  end() {
    if (this.ended) return;
    this.ended = true;
    useAnimationState.setState(() => ({ finished: true }));
  }

  remove() {
    if (!this.carElement) return;
    this.carElement.style.transform = `translateX(-100%)`;
  }

  update(deltaTime: number = 1) {
    if (this.ended) {
      console.error("YOU SHOULDN'T UPDATE AFTER END WAS TRIGGERED");
      return 0;
    }
    if (!this.carElement || !this.car) return 0;

    if (
      this.car.position <=
      this.carElement.getBoundingClientRect().width + window.innerWidth
    ) {
      this.car.update(deltaTime);
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
