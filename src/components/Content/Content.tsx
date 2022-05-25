import { useState, useRef, useEffect, FC } from "react";
import main_scene from "./content.module.css";
import Street from "./Street/Street";
import Scene from "./Scene/Scene";
// import BlurProvider from "context/animationContext";

const MainScene: FC = () => {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });
  const sceneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scene = sceneRef.current as HTMLDivElement;
    setDimensions({
      width: scene.getBoundingClientRect().width,
      height: scene.getBoundingClientRect().height,
    });

    window.addEventListener("resize", () => {
      setDimensions({
        width: scene.getBoundingClientRect().width,
        height: scene.getBoundingClientRect().height,
      });
    });
  }, []);
  return (
    <div
      ref={sceneRef}
      className='relative overflow-hidden w-screen flex-1 flex flex-col-reverse'>
      <Scene width={dimensions.width} height={dimensions.height}></Scene>
      <Street></Street>
    </div>
  );
};

export default MainScene;
