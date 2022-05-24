import { FC } from "react";

const HEADER: string = "SistemgaS";
const SUBTITLE: string = "O noua perspectiva";

const Header: FC = () => {
  return (
    // <div className={header.container}>
    //   <div className={header.title}>
    //     {[...HEADER].map((letter, index) => {
    //       if (letter === "i")
    //         return (
    //           <div key={index} className={header.letterContainer}>
    //             <div className={header.text}>{letter}</div>
    //             <div className={header.img}>
    //               <Image alt='🔥' src='/fire.svg' layout='fill'></Image>
    //             </div>
    //           </div>
    //         );
    //       return (
    //         <div key={index} className={header.letterContainer}>
    //           <div className={header.span}>
    //             <div className={header.text}>{letter}</div>
    //           </div>
    //         </div>
    //       );
    //     })}
    //   </div>
    //   <div className={header.subtitle}> {SUBTITLE} </div>
    // </div>
    <div className='flex w-screen h-20 bg-slate-700 justify-center items-center'>
      <h1 className='text-xl text-white'>{HEADER}</h1>
    </div>
  );
};

export default Header;
