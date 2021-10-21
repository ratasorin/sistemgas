import type { NextPage } from "next";
import main_header from "./main-header.module.css";
import Image from "next/image";
import Street from "../Street/Street";

const MainHeader: NextPage = () => {
  return (
    <div className={main_header.container}>
      {/* <Sky></Sky> */}
      {/* <Car></Car> */}
      <Street></Street>
    </div>
  );
};

export default MainHeader;
