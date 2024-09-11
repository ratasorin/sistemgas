export type RelativePositions = "right" | "newline" | "start";
export type FontDecoration = "italic" | "underline";
export type FontSize =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "bold";

export type Styles = `${FontSize} ${FontDecoration}` | FontSize;

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
      x: fontPadding?.x || 0,
      y: Math.ceil(fontSize / 3.5) + (fontPadding ? fontPadding?.y : 0),
    };
    this.position = position;
    this.fontStyle = fontStyle;
  }
}
