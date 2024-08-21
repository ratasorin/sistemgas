import { useAnimationState } from "components/Content/Scene/Car/Car";
import { FC, useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { IoPlaySkipForward } from "react-icons/io5";

const SECTIONS = ["DESPRE NOI", "ACASA", "CONTACT", "NOUTATI", "SERVICII"];

const Navbar: FC = () => {
  const [open, setOpen] = useState(false);
  const { forceEnd, finished } = useAnimationState();

  if (!open)
    return (
      <div className="relative z-[10000] mx-8 mt-8 flex justify-between">
        <button
          className="p-2 rounded-full bg-zinc-800/75 hover:cursor-pointer z-30"
          onClick={() => setOpen(true)}
        >
          <IoMdMenu className="text-3xl sm:text-4xl lg:text-5xl text-white" />
        </button>
        <button
          disabled={forceEnd || finished}
          className="p-2 rounded-full bg-zinc-800/75 text hover:cursor-pointer z-30 disabled:cursor-not-allowed disabled:hover:cursor-not-allowed disabled:bg-zinc-700/40"
          onClick={() => useAnimationState.setState(() => ({ forceEnd: true }))}
        >
          <IoPlaySkipForward className="text-3xl sm:text-4xl lg:text-5xl text-white" />
        </button>
      </div>
    );
  return (
    <>
      <div className="absolute top-0 left-0 w-screen h-screen z-[1000] flex flex-col lg:flex-row items-center justify-evenly p-10 bg-black/60">
        <button
          className="absolute left-5 top-5 sm:top-7 sm:left-7 lg:top-10 lg:left-10 p-2 rounded-full bg-zinc-800/75 hover:cursor-pointer z-30"
          onClick={() => setOpen(false)}
        >
          <IoMdClose className="text-3xl sm:text-4xl lg:text-5xl text-white" />
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
            <div className="bg-black/60 px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl">
              <h1 className="text-base sm:text-lg lg:text-2xl font-mono text-white">
                {section}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Navbar;
