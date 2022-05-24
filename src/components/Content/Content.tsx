import { useState, useRef, useEffect, FC } from "react";
import main_scene from "./content.module.css";
import Street from "./Street/Street";
import Scene from "./Scene/Scene";
import BlurProvider from "context/animationContext";

const MainScene: FC = () => {
  const [dimensions, setDimensions] = useState([0, 0]);
  const sceneRef = useRef<HTMLDivElement>(null);
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
    <BlurProvider>
      <div ref={sceneRef} className={main_scene.container}>
        <Scene {...{ width: dimensions[0], height: dimensions[1] }}></Scene>
        <Street></Street>
      </div>
    </BlurProvider>
  );
};

export default MainScene;
