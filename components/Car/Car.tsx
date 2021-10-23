import type { NextPage } from "next";
import car from "./car.module.css";
import Image from "next/image";
import Canvas from "../Canvas/Canvas";
import { useRef, useState, useEffect } from "react";
const Car: NextPage = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const div = parentRef.current as HTMLDivElement;
    setWidth(div.getBoundingClientRect().width);
    setHeight(div.getBoundingClientRect().height);

    console.log(width, height);
  }, [parentRef.current]);
  return (
    <div ref={parentRef} className={car.container}>
      <Canvas {...{ width, height }}></Canvas>
    </div>
  );
};

export default Car;
