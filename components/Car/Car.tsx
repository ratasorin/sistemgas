import type { NextPage } from "next";
import car from "./car.module.css";
import Image from "next/image";
import Canvas from "../Canvas/Canvas";
import { useRef, useState, useEffect, useContext } from "react";
import { AnimationContext } from "../../context/animationContext";
import { drawCar, drawText, drawCarRandomDirection } from "./Draw";
import { DrawParameters } from "./Draw";

const Car: NextPage = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [{ timesAnimated, animate }, setAnimationDetails] =
    useContext(AnimationContext);
  const [drawingsOnTop, setDrawingsOnTop] = useState([drawText, drawCar]);
  const [drawingsOnSecond, setDrawingsOnSecond] = useState(
    [] as ((drawingProps: DrawParameters) => void)[]
  );
  useEffect(() => {
    switch (animate) {
      case true: {
        if (timesAnimated >= 1) {
          setDrawingsOnTop([drawText]);
          setDrawingsOnSecond([drawCarRandomDirection]);
        }
      }
      case false: {
        if (timesAnimated >= 1) {
          setDrawingsOnSecond([]);
        }
      }
    }
  }, [animate]);

  const className =
    timesAnimated >= 1 ? `${car.container} ${car.blur}` : `${car.container}`;
  useEffect(() => {
    const div = parentRef.current as HTMLDivElement;
    setWidth(div.getBoundingClientRect().width);
    setHeight(div.getBoundingClientRect().height);
  }, [parentRef.current]);
  return (
    <div ref={parentRef} className={className}>
      <Canvas {...{ width, height, drawings: drawingsOnTop }}></Canvas>
      <Canvas {...{ width, height, drawings: drawingsOnSecond }}></Canvas>
    </div>
  );
};

export default Car;
