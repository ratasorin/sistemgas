import type { NextPage } from "next";
import street from "./street.module.css";
import { BlurContext } from "../../context/animationContext";
import { useContext } from "react";
const paddles = [1, 1, 1, 1, 1, 1, 1];

const Street: NextPage = () => {
  const { shouldBlur } = useContext(BlurContext);
  const className = shouldBlur
    ? `${street.container} ${street.blur}`
    : `${street.container}`;
  return (
    <div className={className}>
      {paddles.map((paddle, index) => {
        return <div key={paddle * index} className={`${street.paddle}`}></div>;
      })}
    </div>
  );
};

export default Street;
