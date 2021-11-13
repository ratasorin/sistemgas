import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import Canvas from "../Canvas/Canvas";
import scene from "./scene.module.css";
const Scene: NextPage = () => {
  const [dimensions, setDimensions] = useState([0, 0]);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current as HTMLDivElement;
    setDimensions([
      scene.getBoundingClientRect().width,
      scene.getBoundingClientRect().height,
    ]);

    scene.addEventListener("resize", () => {
      setDimensions([
        scene.getBoundingClientRect().width,
        scene.getBoundingClientRect().height,
      ]);
    });
  }, []);
  return (
    <div ref={sceneRef} className={scene.container}>
      <Canvas
        {...{ width: dimensions[0], height: dimensions[1], toDraw: "car" }}
      ></Canvas>

      {/* <Canvas
        {...{ width: dimensions[0], height: dimensions[1], toDraw: "text" }}
      ></Canvas> */}
    </div>
  );
};

export default Scene;
