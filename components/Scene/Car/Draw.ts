import type { FinalText } from "../Text/TextCustomizations";
/**
 * We will use a more generic approach with the DrawParameters so we avoid the
 * need to specify all the common types multiple times.
 */
export interface DrawParameters {
  text: FinalText | FinalText[];
  image: HTMLImageElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  x: number;
  maskWidth: number;
  AnimationDetails: {
    timesAnimated: number;
    animate: boolean;
  };
  setAnimationDetails: (AnimationDetails: {
    timesAnimated: number;
    animate: boolean;
  }) => void;
}

let scaleH: 1 | -1;

export const drawText = (drawingProps: DrawParameters) => {
  drawingProps.context.clearRect(
    0,
    0,
    drawingProps.canvas.width,
    drawingProps.canvas.height
  );
  if (!Array.isArray(drawingProps.text)) {
    drawingProps.context.globalCompositeOperation = "destination-over";
    drawingProps.context.save();
    drawingProps.context.fillStyle = `${drawingProps.text.fontColor}`;
    drawingProps.context.font = `${drawingProps.text.fontSize}px ${drawingProps.text.fontFamily}`;
    drawingProps.context.fillText(
      `${drawingProps.text.payload}`,
      drawingProps.text.coordinates[0],
      drawingProps.text.coordinates[1]
    );
    drawingProps.context.globalCompositeOperation = "destination-out";

    drawingProps.context.restore();
  } else {
    drawingProps.text.forEach((text_) => {
      drawingProps.context.globalCompositeOperation = "destination-over";
      drawingProps.context.save();
      drawingProps.context.fillStyle = `${text_.fontColor}`;
      drawingProps.context.font = `${text_.fontSize}px ${text_.fontFamily}`;
      drawingProps.context.fillText(
        `${text_.payload}`,
        text_.coordinates[0],
        text_.coordinates[1]
      );
      drawingProps.context.globalCompositeOperation = "destination-out";
      drawingProps.context.fillRect(
        -drawingProps.canvas.width + drawingProps.x + 50,
        0,
        drawingProps.maskWidth,
        drawingProps.canvas.height
      );
      drawingProps.context.restore();
    });
  }
};
