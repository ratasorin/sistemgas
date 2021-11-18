import type { NextPage } from "next";
import main_header from "./main-header.module.css";
import Image from "next/image";
import Street from "../Street/Street";
import Car from "../Scene/Car/Car";
import Scene from "../Scene/Scene";
import BlurProvider from "../../context/animationContext";
const MainHeader: NextPage = () => {
  return (
    <BlurProvider>
      <div className={main_header.container}>
        <Scene></Scene>
        <Street></Street>
      </div>
    </BlurProvider>
  );
};

export default MainHeader;
