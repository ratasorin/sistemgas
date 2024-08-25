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
  padding: { top: number; left: number; right: number; bottom: number } = {
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
  };
  border: { top: number; left: number; right: number; bottom: number } = {
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
    this.x = 0;
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
    this.context.globalCompositeOperation = "source-over";
    this.context.globalAlpha = 1;

    this.context.clearRect(
      0,
      0,
      Math.ceil(getCanvasDimensions(this.canvas).width),
      Math.ceil(getCanvasDimensions(this.canvas).height)
    );

    // text box background
    this.context.beginPath();
    this.context.fillStyle = "#ffffff";
    this.context.strokeStyle = "#e2e8f0";
    this.context.lineWidth = 2;
    this.context.roundRect(
      Math.floor(this.textBoxCoordinates.x - this.padding.left),
      Math.floor(this.textBoxCoordinates.y - this.padding.top),
      Math.floor(this.textBox.width + 2 * this.padding.right),
      Math.floor(this.textBox.height + 2 * this.padding.bottom),
      10
    );
    this.context.stroke();
    this.context.fill();
    this.context.restore();

    const offsetX =
      (this.coordinates?.x || 0) - (this.textBoxCoordinates.x || 0);
    const offsetY =
      (this.coordinates?.y || 0) - (this.textBoxCoordinates.y || 0);

    this.text.forEach((text_) => {
      if (!this.canvas || !this.context || !this.text) return;

      this.context.fillStyle = `${text_.fontColor}`;
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

    this.context.save();
    this.context.globalCompositeOperation = "source-over";
    this.context.globalAlpha = 1;

    this.context.clearRect(
      Math.floor(
        this.textBoxCoordinates.x - this.padding.top - this.border.left
      ),
      Math.floor(
        this.textBoxCoordinates.y - this.padding.bottom - this.border.top
      ),
      Math.floor(
        this.textBox.width + 2 * (this.padding.left + this.border.right)
      ) + 200,
      Math.floor(
        this.textBox.height + 2 * (this.padding.bottom + this.border.bottom)
      ) + 200
    );

    this.context.beginPath();
    this.context.fillStyle = "#ffffff";
    this.context.strokeStyle = "#e2e8f0";
    this.context.lineWidth = 2;
    this.context.roundRect(
      Math.floor(this.textBoxCoordinates.x - this.padding.left),
      Math.floor(this.textBoxCoordinates.y - this.padding.top),
      Math.floor(this.textBox.width + 2 * this.padding.right),
      Math.floor(this.textBox.height + 2 * this.padding.bottom),
      10
    );
    this.context.stroke();
    this.context.fill();
    this.context.restore();

    const offsetX =
      (this.coordinates?.x || 0) - (this.textBoxCoordinates.x || 0);
    const offsetY =
      (this.coordinates?.y || 0) - (this.textBoxCoordinates.y || 0);

    this.text.forEach((text_) => {
      if (!this.canvas || !this.context || !this.text) return;

      this.context.save();
      this.context.fillStyle = `${text_.fontColor}`;
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
