import { getCanvasDimensions } from "../Canvas/helper/canvas-dimensions";
import { fitCarInsideCanvas, getScaleCoefficient } from "../Car/Car";
import { Render } from "../Scene";
import {
  Coordinates,
  Dimensions,
  TextWithCoordinates,
  getFirstWordPosition,
  getTextDimensions,
  textWithAbsoluteCoordinates,
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
  textBoxCoordinates: Coordinates | undefined;
  carVelocity: number = 0;
  heightFactor: number = 0;
  coordinates: Coordinates | undefined;
  padding: BoxPosition = {
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
  };
  border: BoxPosition = {
    top: 3,
    left: 3,
    right: 3,
    bottom: 3,
  };

  initializeCanvas(canvas: HTMLCanvasElement, dpr: number) {
    this.canvas = canvas;

    const { carDestinationHeight } = fitCarInsideCanvas({
      canvasDimensions: getCanvasDimensions(this.canvas),
      carDimensions: this.carImage,
    });
    const carDisplayHeight =
      carDestinationHeight * getScaleCoefficient(this.canvas, this.carImage);

    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.text = textWithAbsoluteCoordinates(
      this.initialText,
      this.context,
      getCanvasDimensions(this.canvas),
      carDisplayHeight
    );
    this.textBox = getTextDimensions(this.text, this.context);
    textBox = getTextDimensions(this.text, this.context);
    this.textBoxCoordinates = getFirstWordPosition(
      this.text,
      this.context,
      getCanvasDimensions(this.canvas),
      carDisplayHeight
    );
    this.coordinates = getFirstWordPosition(
      this.text,
      this.context,
      getCanvasDimensions(this.canvas),
      carDisplayHeight
    );
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
    carVelocity: number,
    heightFactor: number
  ) {
    this.initialText = providedText;
    this.x = -300;
    this.carImage = carImage;
    this.carVelocity = carVelocity;
    this.heightFactor = heightFactor;
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
    if (
      !this.canvas ||
      !this.context ||
      !this.text ||
      !this.textBoxCoordinates ||
      !this.textBox
    )
      return;

    this.context.save();

    this.context.clearRect(
      0,
      0,
      Math.ceil(getCanvasDimensions(this.canvas).width),
      Math.ceil(getCanvasDimensions(this.canvas).height)
    );

    const offsetX =
      (this.coordinates?.x || 0) - (this.textBoxCoordinates.x || 0);
    const offsetY =
      (this.coordinates?.y || 0) - (this.textBoxCoordinates.y || 0);

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
        Math.floor(-offsetX + text_.coordinates.x),
        Math.floor(-offsetY + text_.coordinates.y)
      );
    });
  }

  render() {
    if (
      !this.canvas ||
      !this.context ||
      !this.text ||
      !this.textBoxCoordinates ||
      !this.textBox
    )
      return;
    this.context.clearRect(
      0,
      0,
      Math.ceil(getCanvasDimensions(this.canvas).width),
      Math.ceil(getCanvasDimensions(this.canvas).height)
    );
    const offsetX =
      (this.coordinates?.x || 0) - (this.textBoxCoordinates.x || 0);
    const offsetY =
      (this.coordinates?.y || 0) - (this.textBoxCoordinates.y || 0);

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
        Math.floor(-offsetX + text_.coordinates.x),
        Math.floor(-offsetY + text_.coordinates.y)
      );

      const coefficient = getScaleCoefficient(this.canvas, this.carImage);
      const { carDestinationHeight, carDestinationWidth } = fitCarInsideCanvas({
        canvasDimensions: getCanvasDimensions(this.canvas),
        carDimensions: this.carImage,
      });

      // because we cannot render the car and the text on the same canvas, we emulate
      // how the car would mask the text using this empty rectangle
      this.context.globalCompositeOperation = "destination-out";
      this.context.fillRect(
        this.x -
          carDestinationWidth * coefficient +
          (carDestinationWidth * coefficient) / 2,
        0,
        Math.floor(4 * getCanvasDimensions(this.canvas).width),
        Math.floor(getCanvasDimensions(this.canvas).height)
      );

      this.context.restore();
    });
  }
}
