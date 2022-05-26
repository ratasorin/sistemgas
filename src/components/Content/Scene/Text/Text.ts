import { Render } from "../Scene";
import {
  Customizations,
  CustomizedText,
  TextToBuild,
} from "./helpers/customize";
import { getTextPosition, Text } from "./helpers/math/coordinates";

export default class TextRenderer implements Render {
  text: Text | Text[];
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  x: number;
  constructor(
    customizations: CustomizedText | CustomizedText[],
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) {
    console.log({ customizations });
    this.text = getTextPosition(customizations, context, canvas);
    this.canvas = canvas;
    this.context = context;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.x = 0;
  }
  update(): false {
    if (this.x <= 2 * this.canvas.width) this.x += 4;
    return false;
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillRect(this.canvas.width / 2, 0, 10, this.canvas.height);
    this.context.fillRect(0, this.canvas.height / 2, this.canvas.width, 10);

    if (!Array.isArray(this.text)) {
      this.context.globalCompositeOperation = "destination-over";
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.save();
      this.context.fillStyle = `${this.text.fontColor}`;
      this.context.font = `${this.text.fontSize}px ${this.text.fontFamily}`;
      this.context.textBaseline = "middle";
      this.context.fillText(
        `${this.text.payload}`,
        this.text.position.x,
        this.text.position.y
      );
      this.context.globalCompositeOperation = "destination-out";
      this.context.restore();
    } else {
      this.text.forEach((text_) => {
        this.context.globalCompositeOperation = "destination-over";
        this.context.save();
        this.context.fillStyle = `${text_.fontColor}`;
        this.context.font = `${text_.fontSize}px ${text_.fontFamily}`;
        this.context.textBaseline = "top";
        this.context.fillText(
          `${text_.payload}`,
          text_.position.x,
          text_.position.y
        );
        this.context.textAlign = "center";
        this.context.globalCompositeOperation = "destination-out";
        this.context.fillRect(
          -this.canvas.width + this.x + 50,
          0,
          2 * this.canvas.width,
          this.canvas.height
        );
        this.context.restore();
      });
    }
  }
}
