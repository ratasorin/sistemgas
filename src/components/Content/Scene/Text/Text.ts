import { getCanvasDimensions } from "../Canvas/helper/element-dimensions";
import { fitCarInsideCanvas } from "../Car/Car";
import { Render } from "../Scene";
import {
  Coordinates,
  Dimensions,
  TextWithCoordinates,
  getTextDimensions,
} from "./helpers/math/coordinates";
import { Text } from "./helpers/text";

export let textBox: Dimensions | undefined;
export type BoxPosition = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

function parseHexColorValues(input: string): {
  values: string[];
  multiple: boolean;
} {
  // Regular expression to match hex color values starting with '#'
  const values = input.match(/#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}/g) || [];

  // Determine if there are multiple hex values
  const multiple = values.length > 1;

  return {
    values,
    multiple,
  };
}

export default class TextRenderer implements Render {
  text: TextWithCoordinates[] | undefined;
  initialText: Text[];
  canvas: HTMLCanvasElement | undefined;
  context: CanvasRenderingContext2D | undefined;
  x: number;
  carImage: HTMLImageElement;
  textBox: Dimensions | undefined;
  carVelocity: number = 0;

  initializeCanvas(canvas: HTMLCanvasElement, dpr: number) {
    this.canvas = canvas;

    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    this.textBox = getTextDimensions(this.initialText, this.context);

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
    providedText: Text[],
    carImage: HTMLImageElement,
    carVelocity: number
  ) {
    this.initialText = providedText;
    this.x = -300;
    this.carImage = carImage;
    this.carVelocity = carVelocity;
  }

  update() {
    if (!this.canvas || !this.context || !this.text) return;

    const { carDestinationWidth } = fitCarInsideCanvas({
      canvasDimensions: getCanvasDimensions(this.canvas),
      carDimensions: this.carImage,
    });

    if (this.x <= carDestinationWidth + getCanvasDimensions(this.canvas).width)
      this.x += this.carVelocity;
  }

  end() {
    if (!this.canvas || !this.context || !this.text || !this.textBox) return;

    this.context.save();

    this.context.clearRect(
      0,
      0,
      Math.ceil(getCanvasDimensions(this.canvas).width),
      Math.ceil(getCanvasDimensions(this.canvas).height)
    );

    this.text.forEach((text_) => {
      if (!this.canvas || !this.context || !this.text) return;

      const { multiple, values } = parseHexColorValues(text_.fontColor);
      if (multiple) {
        const grad = this.context.createLinearGradient(
          text_.coordinates.x,
          text_.coordinates.y,
          text_.coordinates.x + 100,
          text_.coordinates.y + 100
        );
        grad.addColorStop(0, values[0]);
        grad.addColorStop(1, values[1]);
        this.context.fillStyle = grad;
      } else this.context.fillStyle = `${text_.fontColor}`;

      this.context.font = `${text_.fontStyle ? text_.fontStyle : ""} ${
        text_.fontSize
      }px ${text_.fontFamily}`;
      this.context.textBaseline = "top";
      this.context.fillText(
        `${text_.payload}`,
        Math.floor(text_.coordinates.x),
        Math.floor(text_.coordinates.y)
      );
    });
  }

  render() {
    if (!this.canvas || !this.context || !this.text || !this.textBox) return;
    this.context.clearRect(
      0,
      0,
      Math.ceil(getCanvasDimensions(this.canvas).width),
      Math.ceil(getCanvasDimensions(this.canvas).height)
    );

    this.text.forEach((text_) => {
      if (!this.canvas || !this.context || !this.text) return;

      this.context.save();

      const { multiple, values } = parseHexColorValues(text_.fontColor);
      if (multiple) {
        const grad = this.context.createLinearGradient(
          text_.coordinates.x,
          text_.coordinates.y,
          text_.coordinates.x + 100,
          text_.coordinates.y + 100
        );
        grad.addColorStop(0, values[0]);
        grad.addColorStop(1, values[1]);
        this.context.fillStyle = grad;
      } else this.context.fillStyle = `${text_.fontColor}`;

      this.context.font = `${text_.fontStyle ? text_.fontStyle : ""} ${
        text_.fontSize
      }px ${text_.fontFamily}`;
      this.context.textBaseline = "top";
      this.context.fillText(
        `${text_.payload}`,
        Math.floor(text_.coordinates.x),
        Math.floor(text_.coordinates.y)
      );

      const ratio = (window.innerHeight * 0.4) / this.carImage.height;
      const carWidth = window.innerWidth * ratio;

      // because we cannot render the car and the text on the same canvas, we emulate
      // how the car would mask the text using this empty rectangle
      this.context.globalCompositeOperation = "destination-out";
      this.context.fillRect(
        this.x - carWidth + carWidth / 2,
        0,
        Math.floor(4 * getCanvasDimensions(this.canvas).width),
        Math.floor(getCanvasDimensions(this.canvas).height)
      );

      this.context.restore();
    });
  }
}
