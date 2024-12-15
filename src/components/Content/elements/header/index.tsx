import { pillDimensionsAtom } from "components/Content/Scene/pill";
import { useAtomValue } from "jotai";
import React from "react";
import header_styles from "./header.module.css";
import { Button } from "@mui/material";
import EmojiScroll from "./emoji-scroll";

const Header = () => {
  const pillDimensions = useAtomValue(pillDimensionsAtom);

  return (
    <div
      className="absolute z-10 top-[52px] overflow-visible h-[calc(45%-52px)] flex flex-col w-full"
      style={{
        justifyContent: window.innerHeight < 760 ? "flex-end" : "center",
        paddingBottom:
          window.innerHeight < 680
            ? "28px"
            : window.innerHeight < 816
            ? "32px"
            : "0",
      }}
    >
      <div
        className={`text-center overflow-hidden opacity-50 text-sm rounded-2xl bg-cyan-50 relative mb-4 left-1/2 -translate-x-1/2 -translate-y-[2px] top-0 border-2 border-cyan-300 border-dashed`}
        style={{
          width: pillDimensions.width - 6 || 0,
          height: pillDimensions.height - 4 || 0,
          visibility: pillDimensions.width ? "visible" : "hidden",
        }}
      >
        <div
          className={`h-full overflow-hidden ${header_styles["pill-placeholder-scroll"]} whitespace-nowrap w-fit`}
        >
          <EmojiScroll></EmojiScroll>
        </div>
      </div>
      <div
        id="main-text"
        style={{
          position: "relative",
          gap: window.innerHeight < 680 ? "12px" : "16px",
        }}
        className="overflow-visible left-1/2 -translate-x-1/2 w-full flex flex-col justify-center items-center"
      >
        <h3 className="font-poppins px-8 font-extrabold text-center text-[32px] leading-9 md:text-5xl overflow-visible">
          <span className="bg-clip-text font-bold text-transparent bg-gradient-to-r from-orange-600 to-orange-400">
            Alternativa
          </span>{" "}
          <span className="overflow-visible bg-clip-text text-transparent bg-gradient-to-r from-[#1334a0] to-[#3862ee]">
            in furnizarea gazului natural
          </span>
        </h3>
        <Button
          variant="contained"
          className="font-poppins !font-semibold !rounded-lg !bg-gradient-to-r from-[#3862ee] to-[#1334a0]"
        >
          INCEARCA ACUM
        </Button>
      </div>
    </div>
  );
};

export default Header;
