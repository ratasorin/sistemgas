import type { NextPage } from "next";
import street from "./street.module.css";
import { AnimationContext } from "../../context/animationContext";
import { useContext } from "react";
const paddles = [1, 1, 1, 1, 1, 1, 1];

const Street: NextPage = () => {
  const [{ timesAnimated }, _] = useContext(AnimationContext);
  const className =
    timesAnimated >= 1
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
