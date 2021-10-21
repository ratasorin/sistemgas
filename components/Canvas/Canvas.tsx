import { NextPage } from "next";
import { useRef, useEffect } from "react";
import canvas from "./canvas.module.css";
const Canvas: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d") as CanvasRenderingContext2D;
  }, []);

  return <canvas ref={canvasRef} className={canvas.canvas}></canvas>;
};

export default Canvas;
