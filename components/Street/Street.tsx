import type { NextPage } from "next";
import street from "./street.module.css";

const paddles = [1, 1, 1, 1, 1, 1, 1];

const Street: NextPage = () => {
  return (
    <div className={street.container}>
      {paddles.map((paddle, index) => {
        return <div key={paddle * index} className={`${street.paddle}`}></div>;
      })}
    </div>
  );
};

export default Street;
