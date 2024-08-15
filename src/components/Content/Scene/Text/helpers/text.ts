export type RelativePositions = "right" | "newline" | "start";
export type Styles =
  | "bold"
  | "italic"
  | "underline"
  | "bold italic"
  | "italic bold";

export class Text {
  payload: string;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  fontPadding: { x: number; y: number };
  fontStyle: Styles | undefined;
  position: RelativePositions | undefined;

  constructor(
    payload: string,
    fontSize: number,
    fontColor: string,
    fontFamily: string,
    position?: RelativePositions,
    fontStyle?: Styles,
    fontPadding?: { x: number; y: number }
  ) {
    this.payload = payload;
    this.fontSize = fontSize;
    this.fontColor = fontColor;
    this.fontFamily = fontFamily;
    this.fontPadding = {
      x: Math.ceil(fontSize / 2.5) + (fontPadding ? fontPadding?.x : 0),
      y: Math.ceil(fontSize / 3.5) + (fontPadding ? fontPadding?.y : 0),
    };
    console.log({ padding: this.fontPadding });
    this.position = position;
    this.fontStyle = fontStyle;
  }
}
