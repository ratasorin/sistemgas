import { FinalText } from "../Text/TextCustomizations";

interface Render {
  render: () => void;
  update: () => boolean;
}

export default class TextRenderer implements Render {
  text: FinalText | FinalText[];
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  x: number;
  constructor(
    text: FinalText | FinalText[],
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) {
    this.text = text;
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
    if (!Array.isArray(this.text)) {
      this.context.globalCompositeOperation = "destination-over";
      this.context.save();
      this.context.fillStyle = `${this.text.fontColor}`;
      this.context.font = `${this.text.fontSize}px ${this.text.fontFamily}`;
      this.context.fillText(
        `${this.text.payload}`,
        this.text.coordinates[0],
        this.text.coordinates[1]
      );
      this.context.globalCompositeOperation = "destination-out";
      this.context.restore();
    } else {
      this.text.forEach((text_) => {
        this.context.globalCompositeOperation = "destination-over";
        this.context.save();
        this.context.fillStyle = `${text_.fontColor}`;
        this.context.font = `${text_.fontSize}px ${text_.fontFamily}`;
        this.context.fillText(
          `${text_.payload}`,
          text_.coordinates[0],
          text_.coordinates[1]
        );
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
