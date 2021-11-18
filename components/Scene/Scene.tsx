import type { NextPage } from "next";
import { useEffect, useRef, useState, useContext } from "react";
import { BlurContext } from "../../context/animationContext";
import Canvas from "../Canvas/Canvas";
import scene from "./scene.module.css";
const Scene: NextPage = () => {
  const [dimensions, setDimensions] = useState([0, 0]);
  const sceneRef = useRef<HTMLDivElement>(null);
  const { shouldBlur } = useContext(BlurContext);
  const classNameCar = shouldBlur
    ? `${scene.canvasElem} ${scene.blur} ${scene.below}`
    : `${scene.canvasElem}`;
  useEffect(() => {
    const scene = sceneRef.current as HTMLDivElement;
    setDimensions([
      scene.getBoundingClientRect().width,
      scene.getBoundingClientRect().height,
    ]);

    window.addEventListener("resize", () => {
      setDimensions([
        scene.getBoundingClientRect().width,
        scene.getBoundingClientRect().height,
      ]);
    });
  }, []);
  return (
    <div ref={sceneRef} className={scene.container}>
      <div className={scene.canvasElem}>
        <Canvas
          {...{ width: dimensions[0], height: dimensions[1], toDraw: "text" }}
        ></Canvas>
      </div>
      <div className={classNameCar}>
        <Canvas
          {...{ width: dimensions[0], height: dimensions[1], toDraw: "car" }}
        ></Canvas>
      </div>
    </div>
  );
};

export default Scene;
