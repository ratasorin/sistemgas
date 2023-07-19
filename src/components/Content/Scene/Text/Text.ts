import { INITIAL_CAR_VELOCITY, imageDisplayDimensions } from "../Car/Car";
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
  image: HTMLImageElement;
  textBox: Dimensions | undefined;
  textBoxCoordinates: Coordinates | undefined;

  ready() {
    return true;
  }

  initializeCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.text = textWithAbsoluteCoordinates(
      this.initialText,
      this.context,
      this.canvas
    );
    this.textBox = getTextDimensions(this.text, this.context);
    this.textBoxCoordinates = getFirstWordPosition(
      this.text,
      this.context,
      this.canvas
    );
  }

  constructor(providedText: Text[], carImage: HTMLImageElement) {
    this.initialText = providedText;
    this.x = 0;
    this.image = carImage;
  }

  update() {
    if (!this.canvas || !this.context || !this.text) return;

    const { carDisplayWidth } = imageDisplayDimensions(
      this.image,
      this.canvas.height
    );

    if (this.x <= carDisplayWidth + this.canvas.width)
      this.x += INITIAL_CAR_VELOCITY;
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

    this.context.save();
    this.context.globalCompositeOperation = "source-over";
    this.context.globalAlpha = 0.7;

    const wordPadding = this.text[0].fontPadding;
    const textBoxPadding = wordPadding * 3;
    const outlineWidth = wordPadding / 3;

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
        text_.coordinates.x,
        text_.coordinates.y
      );

      const { carDisplayWidth } = imageDisplayDimensions(
        this.image,
        this.canvas.height
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
