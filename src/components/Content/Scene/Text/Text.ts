import { imageDisplayDimensions } from "../Car/Car";
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
  averageWordPadding: number = 0;

  ready() {
    return true;
  }

  initializeCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const { carDisplayHeight } = imageDisplayDimensions(
      this.carImage,
      this.canvas.height,
      this.heightFactor
    );

    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.text = textWithAbsoluteCoordinates(
      this.initialText,
      this.context,
      this.canvas,
      this.heightFactor,
      carDisplayHeight
    );
    this.textBox = getTextDimensions(this.text, this.context);
    this.textBoxCoordinates = getFirstWordPosition(
      this.text,
      this.context,
      this.canvas,
      this.heightFactor,
      carDisplayHeight
    );
    this.coordinates = getFirstWordPosition(
      this.text,
      this.context,
      this.canvas,
      this.heightFactor,
      carDisplayHeight
    );

    const averageWordPadding =
      this.text.reduce((prev, curr) => prev + curr.fontPadding.x, 0) /
      this.text.length;

    this.averageWordPadding = averageWordPadding;
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

    const { carDisplayWidth } = imageDisplayDimensions(
      this.carImage,
      this.canvas.height,
      this.heightFactor
    );

    if (this.x <= carDisplayWidth + this.canvas.width)
      this.x += this.carVelocity;
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

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // horizontal line
    // this.context.fillRect(this.canvas.width / 2, 0, 2, this.canvas.height);
    // vertical line
    // this.context.fillRect(0, this.canvas.height / 2, this.canvas.width, 2);
    const textBoxPadding = this.averageWordPadding * 3;
    const outlineWidth = this.averageWordPadding / 3;

    this.context.save();
    this.context.globalCompositeOperation = "source-over";
    this.context.globalAlpha = 0.7;

    // text box outline
    this.context.beginPath();
    this.context.fillStyle = "#e2e8f0";
    this.context.roundRect(
      this.textBoxCoordinates.x - textBoxPadding - outlineWidth,
      this.textBoxCoordinates.y - textBoxPadding - outlineWidth,
      this.textBox.width + 2 * (textBoxPadding + outlineWidth),
      this.textBox.height + 2 * (textBoxPadding + outlineWidth),
      10
    );
    this.context.fill();

    // text box background
    this.context.beginPath();
    this.context.fillStyle = "#f8fafc";
    this.context.roundRect(
      this.textBoxCoordinates.x - textBoxPadding,
      this.textBoxCoordinates.y - textBoxPadding,
      this.textBox.width + 2 * textBoxPadding,
      this.textBox.height + 2 * textBoxPadding,
      10
    );
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
        -offsetX + text_.coordinates.x,
        -offsetY + text_.coordinates.y
      );

      const { carDisplayWidth } = imageDisplayDimensions(
        this.carImage,
        this.canvas.height,
        this.heightFactor
      );

      // because we cannot render the car and the text on the same canvas, we emulate
      // how the car would mask the text using this empty rectangle
      this.context.globalCompositeOperation = "destination-out";
      this.context.fillRect(
        this.x - carDisplayWidth + carDisplayWidth / 10,
        0,
        carDisplayWidth + this.canvas.width,
        this.canvas.height
      );

      this.context.restore();
    });
  }
}
