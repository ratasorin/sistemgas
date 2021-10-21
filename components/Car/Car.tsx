import type { NextPage } from "next";
import car from "./car.module.css";
import Image from "next/image";
const Car: NextPage = () => {
  return (
    <div className={car.container}>
      <Canvas></Canvas>
    </div>
  );
};

export default Car;
