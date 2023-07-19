import { FC, useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";

const SECTIONS = ["DESPRE NOI", "ACASA", "CONTACT", "NOUTATI", "SERVICII"];

const Navbar: FC = () => {
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <button
        className="absolute top-10 left-10 p-2 rounded-full bg-zinc-800/75 hover:cursor-pointer z-30"
        onClick={() => setOpen(true)}
      >
        <IoMdMenu className="text-5xl text-white" />
      </button>
    );
  return (
    <div className="absolute top-0 left-0 w-screen h-screen z-30 flex flex-col lg:flex-row items-center justify-evenly p-10 bg-black/60">
      <button
        className="absolute top-10 left-10 p-2 rounded-full bg-zinc-800/75 hover:cursor-pointer z-30"
        onClick={() => setOpen(false)}
      >
        <IoMdClose className="text-5xl text-white" />
      </button>

      {SECTIONS.map((section) => (
        <div className="relative flex flex-col items-center hover:scale-110 transition-all hover:cursor-pointer">
          <img
            src={`/Navbar/Images/${section
              .toLocaleLowerCase()
              .replace(" ", "-")}.svg`}
            alt={section}
            className="flex-1 w-full"
          />
          <div className="bg-black/60 px-4 py-2 rounded-xl">
            <h1 className="text-2xl font-mono text-white">{section}</h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Navbar;
