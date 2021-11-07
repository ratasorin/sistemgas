import type { NextPage } from "next";
import car from "./car.module.css";
import Image from "next/image";
import Canvas from "../Canvas/Canvas";
import { useRef, useState, useEffect, useContext } from "react";
import { AnimationContext } from "../../context/animationContext";
import { DrawParameters } from "./Draw";

const Car: NextPage = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const className = `${car.container} ${car.blur}`;
  useEffect(() => {
    const div = parentRef.current as HTMLDivElement;
    setWidth(div.getBoundingClientRect().width);
    setHeight(div.getBoundingClientRect().height);
  }, [parentRef.current]);
  return (
    <div ref={parentRef} className={className}>
      <Canvas {...{ width, height, toDraw: "car" }}></Canvas>
    </div>
  );
};

export default Car;
