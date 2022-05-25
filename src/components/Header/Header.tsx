import { FC } from "react";
import Image from "next/image";

const HEADER: string = "SistemgaS";
const SUBTITLE: string = "O noua perspectiva";

const Header: FC = () => {
  return (
    <div className='flex justify-center items-center flex-col w-screen h-52 p-5 mt-20 relative'>
      <a className='h-full w-full mr-10 relative transition-all hover:scale-110 hover:cursor-pointer'>
        <Image
          src={"/header/images/sistemgas.svg"}
          alt={HEADER}
          layout='fill'
          objectFit='contain'
        />
      </a>
      <div className='ml-10 text-2xl italic overflow-visible h-2/3 flex justify-center items-center'>
        {" "}
        {SUBTITLE}{" "}
      </div>
    </div>
  );
};

export default Header;
