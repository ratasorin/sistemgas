import type { NextPage } from "next";
import { useAppSelector } from "hooks/redux";
const paddles = [1, 1, 1, 1, 1];

const Street: NextPage = () => {

  return (
    <div
      className={`absolute z-0 right-0 w-[calc(100vw+100vw/4)] h-1/5 shadow-slate-900 flex items-center bg-gray-500 scale-125`}
    >
      {paddles.map((paddle, index) => {
        return (
          <div
            key={paddle * index}
            className="relative mr-[calc(100vw/8)] w-[calc(100vw/8)] h-3 bg-white animate-slide"
          ></div>
        );
      })}
    </div>
  );
};

export default Street;
