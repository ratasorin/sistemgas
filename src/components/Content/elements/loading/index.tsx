import React from "react";
import loading_styles from "./loading.module.css";

const Loading = () => {
  return (
    <div className="absolute z-50 w-screen h-screen bg-black/60 flex flex-col items-center justify-center">
      <div className={loading_styles["fire"]}>
        <div className={loading_styles["fire-left"]}>
          <div className={loading_styles["fire-left__main-fire"]}></div>
          <div className={loading_styles["fire-left__particle-fire"]}></div>
        </div>
        <div className={loading_styles["fire-center"]}>
          <div className={loading_styles["fire-center__main-fire"]}></div>
          <div className={loading_styles["fire-center__particle-fire"]}></div>
        </div>
        <div className={loading_styles["fire-right"]}>
          <div className={loading_styles["fire-right__main-fire"]}></div>
          <div className={loading_styles["fire-right__particle-fire"]}></div>
        </div>

        <div className={loading_styles["fire-bottom"]}>
          <div className={loading_styles["main-fire"]}></div>
        </div>
      </div>
      <h2 className="text-white text-3xl overflow-hidden font-bold mt-4">
        LOADING...
      </h2>
    </div>
  );
};

export default Loading;
