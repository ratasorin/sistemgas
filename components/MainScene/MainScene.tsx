import type { NextPage } from "next";
import main_scene from "./main-scene.module.css";
import Street from "../Street/Street";
import Scene from "../Scene/Scene";
import BlurProvider from "../../context/animationContext";

const MainScene: NextPage = () => {
  return (
    <BlurProvider>
      <div className={main_scene.container}>
        <Scene></Scene>
        <Street></Street>
      </div>
    </BlurProvider>
  );
};

export default MainScene;
