import { useState, useRef, useEffect, FC } from "react";
import content from "./content.module.css";
import Scene from "./Scene/Scene";

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
      className="relative overflow-hidden w-screen flex-1 flex flex-col-reverse"
    >
      <Scene width={dimensions.width} height={dimensions.height}></Scene>
      <div className={content.clouds_back}></div>
      <div className={content.mountains}></div>
      <div className={content.clouds_front}></div>
      <div className={content.trees}></div>
      <div className={content.street}></div>
    </div>
  );
};

export default MainScene;
