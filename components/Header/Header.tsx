import type { NextPage } from "next";
import header from "./header.module.css";
import Image from "next/image";

const HeaderTitle: string = "SistemgaS";
const Subtitle: string = "o noua perspectiva";

const Header: NextPage = () => {
  return (
    <div className={header.container}>
      <div className={header.title}>
        {[...HeaderTitle].map((letter, index) => {
          if (letter === "i")
            return (
              <div key={index} className={header.letterContainer}>
                <div className={header.text}>{letter}</div>
                <div className={header.img}>
                  <Image alt="🔥" src="/fire.svg" layout="fill"></Image>
                </div>
              </div>
            );
          return (
            <div key={index} className={header.letterContainer}>
              <div className={header.span}>
                <div className={header.text}>{letter}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={header.subtitle}> {Subtitle} </div>
    </div>
  );
};

export default Header;
