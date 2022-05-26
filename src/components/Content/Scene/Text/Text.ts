import CanvasText, {
  FinalText,
  Positions,
  RelativePositions,
  TextToBuild,
} from "./TextCustomizations";
import { Render } from "../Scene";

const getPosition = (
  text: TextToBuild | TextToBuild[],
  context: CanvasRenderingContext2D
) => {
  console.log({ text });
  if (!Array.isArray(text)) {
    if (Array.isArray(text.positions))
      throw new Error(
        "You cannot provide an array of positions for a single word"
      );
    context.font = `${text.fontSize}px ${text.fontFamily}`;
    const { fontBoundingBoxDescent, fontBoundingBoxAscent, width } =
      context.measureText(text.payload as string);

    return {
      width,
      height: fontBoundingBoxAscent + fontBoundingBoxDescent,
    };
  } else {
    const { height, maxWidth, width } = text.reduce(
      (prev, text_, index) => {
        context.font = `${text_.fontSize}px ${text_.fontFamily}`;
        const metrics = context.measureText(text_.payload as string);
        const fontWidth = metrics.width;
        const fontHeight =
          metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;

        if (index === 0)
          return {
            maxWidth: fontWidth,
            width: fontWidth,
            height: prev.height + fontHeight,
          };
        const position = text_.positions as RelativePositions;
        if (position === "right")
          return {
            maxWidth: prev.maxWidth,
            width: prev.width + fontWidth,
            height: prev.height,
          };
        if (position === "newline")
          return {
            maxWidth: prev.maxWidth > prev.width ? prev.maxWidth : prev.width,
            width: fontWidth,
            height: prev.height + fontHeight,
          };

        return prev;
      },
      {
        maxWidth: 0,
        width: 0,
        height: 0,
      }
    );
    return {
      width: maxWidth > width ? maxWidth : width,
      height,
    };
  }
};

export default class TextRenderer implements Render {
  text: FinalText | FinalText[];
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  x: number;
  constructor(
    presentationTitle: CanvasText,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) {
    const dimensions = getPosition(presentationTitle.text, context);
    const x = canvas.width / 2 - dimensions.width / 2;
    const y = canvas.height / 2 - dimensions.height / 2;

    console.log({ dimensions });
    this.text = presentationTitle.getFinalText(context, { x, y });

    this.canvas = canvas;
    this.context = context;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.x = 0;
  }
  update(): false {
    if (this.x <= 2 * this.canvas.width) this.x += 4;
    return false;
  }

  // dimensions(
  //   coordinates: Positions
  // ): { width: number; height: number } | Error {}
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
        this.text.coordinates.x,
        this.text.coordinates.y
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
          text_.coordinates.x,
          text_.coordinates.y
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
