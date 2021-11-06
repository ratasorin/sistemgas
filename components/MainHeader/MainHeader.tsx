import type { NextPage } from "next";
import main_header from "./main-header.module.css";
import Image from "next/image";
import Street from "../Street/Street";
import Car from "../Car/Car";
import { AnimationProvider } from "../../context/animationContext";
const MainHeader: NextPage = () => {
  return (
    <AnimationProvider>
      <div className={main_header.container}>
        <Car></Car>
        <Street></Street>
      </div>
    </AnimationProvider>
  );
};

export default MainHeader;
