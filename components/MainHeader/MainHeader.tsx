import type { NextPage } from "next";
import main_header from "./main-header.module.css";
import Image from "next/image";
import Street from "../Street/Street";
import Car from "../Car/Car";
const MainHeader: NextPage = () => {
  return (
    <div className={main_header.container}>
      <Car></Car>
      <Street></Street>
    </div>
  );
};

export default MainHeader;
