import type { NextPage } from "next";
import street from "./street.module.css";
// import { BlurContext } from "../../../context/animationContext";
import { useContext, useEffect } from "react";
import { useAppSelector } from "hooks/redux";
const paddles = [1, 1, 1, 1, 1, 1, 1];

const Street: NextPage = () => {
  // const { shouldBlur } = useContext(BlurContext);
  // const className = shouldBlur
  //   ? `${street.container} ${street.blur}`
  //   : `${street.container}`;

  const blur = useAppSelector(({ blur }) => blur);

  useEffect(() => {
    console.log(blur);
  }, [blur]);
  return (
    <div
      className={`absolute z-0 right-0 w-[calc(100vw+100vw/6)] h-44 shadow-slate-900 flex items-center bg-gray-500 ${
        blur ? "blur-md" : ""
      }`}>
      {paddles.map((paddle, index) => {
        return <div key={paddle * index} className={`${street.paddle}`}></div>;
      })}
    </div>
  );
};

export default Street;
