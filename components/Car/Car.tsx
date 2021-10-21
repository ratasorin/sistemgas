import type { NextPage } from "next";
import car from "./car.module.css";
import Image from "next/image";
const Car: NextPage = () => {
  return (
    <div className={car.container}>
      <Image
        alt="🚚"
        src="/gas_truck.svg"
        layout="fill"
        objectFit="contain"
        objectPosition="0 0"
      ></Image>
    </div>
  );
};

export default Car;
