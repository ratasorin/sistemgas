import type { NextPage } from "next";
import { useEffect, useRef, useState, useContext } from "react";
import { BlurContext } from "../../../context/animationContext";
import Canvas from "./Canvas/Canvas";
import scene from "./scene.module.css";

export interface Render {
  render: () => void;
  update: () => void;
  blur?: boolean;
}

const Scene: NextPage<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const { shouldBlur } = useContext(BlurContext);
  const classNameCar = shouldBlur
    ? `${scene.canvasElem} ${scene.blur} ${scene.below}`
    : `${scene.canvasElem}`;
  return (
    <div className={scene.container}>
      <div className={scene.canvasElem}>
        <Canvas {...{ width: width, height: height, toDraw: "text" }}></Canvas>
      </div>
      <div className={classNameCar}>
        <Canvas {...{ width: width, height: height, toDraw: "car" }}></Canvas>
      </div>
    </div>
  );
};

export default Scene;
