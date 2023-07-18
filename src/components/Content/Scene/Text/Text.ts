import { Render } from "../Scene";
import {
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
  }

  constructor(providedText: Text[], carImage: HTMLImageElement) {
    this.initialText = providedText;
    this.x = 0;
    this.image = carImage;
  }

  update() {
    if (!this.canvas || !this.context || !this.text) return;

    const carDisplayHeight = (6 / 10) * this.canvas.height;
    const carDisplayWidth =
      this.image.width * (carDisplayHeight / this.image.height);

    if (this.x <= carDisplayWidth + this.canvas.width) this.x += 6;
  }

  render() {
    if (!this.canvas || !this.context || !this.text) return;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // horizontal line
    // this.context.fillRect(this.canvas.width / 2, 0, 2, this.canvas.height);
    // vertical line
    // this.context.fillRect(0, this.canvas.height / 2, this.canvas.width, 2);

    this.text.forEach((text_) => {
      if (!this.canvas || !this.context || !this.text) return;

      this.context.globalCompositeOperation = "destination-over";
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

      const textBox = getTextDimensions(this.text, this.context);
      const textBoxStart = getFirstWordPosition(
        this.text,
        this.context,
        this.canvas
      );

      this.context.textAlign = "center";
      this.context.globalCompositeOperation = "destination-out";

      const carDisplayHeight = (6 / 10) * this.canvas.height;
      const carDisplayWidth =
        this.image.width * (carDisplayHeight / this.image.height);

      // because we cannot render the car and the text on the same canvas, we emulate
      // how the car would mask the text using this empty rectangle
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
