import type { NextPage } from "next";
import main_header from "./main-header.module.css";
import Image from "next/image";
import Street from "../Street/Street";
import Car from "../Car/Car";
import Title from "../MainHeaderTitle/MainHeaderTitle";
const MainHeader: NextPage = () => {
  return (
    <div className={main_header.container}>
      <Car></Car>
      <Street></Street>
      <Title></Title>
    </div>
  );
};

export default MainHeader;
