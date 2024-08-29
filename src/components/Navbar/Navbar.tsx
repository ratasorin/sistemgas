import { useAnimationState } from "components/Content/Scene/Car/Car";
import { FC, useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { IoPlaySkipForward } from "react-icons/io5";

const SECTIONS = ["DESPRE NOI", "ACASA", "CONTACT", "NOUTATI", "SERVICII"];

const Navigation: FC = () => {
  const [open, setOpen] = useState(false);
  const { forceEnd, finished } = useAnimationState();

  return (
    <>
      {!open && (
        <div className="absolute top-3 left-3 z-50 bg-white pt-2 pr-2 pb-2 rounded-br-2xl overflow-visible">
          <button
            className="p-2 rounded-full bg-slate-950 hover:cursor-pointer z-30"
            onClick={() => setOpen(true)}
          >
            <IoMdMenu className="text-xl sm:text-2xl lg:text-3xl text-white" />
          </button>
          <div
            className="absolute w-4 h-4 bg-white left-11 top-1 sm:left-12 lg:left-[54px]"
            style={{
              clipPath: `path("M 0 0 H 0 H 16 A 16 16 0 0 0 0 16 H 16 H 0 Z")`,
            }}
          ></div>
          <div
            className="absolute w-4 h-4 bg-white top-[52px] left-1 sm:top-14 lg:top-[62px]"
            style={{
              clipPath: `path("M 0 0 H 0 H 16 A 16 16 0 0 0 0 16 H 16 H 0 Z")`,
            }}
          ></div>
        </div>
      )}
      <div className="absolute top-3 right-3 z-50 bg-white pt-2 pl-2 pb-2 rounded-bl-2xl overflow-visible">
        <button
          disabled={forceEnd || finished}
          className="p-2 rounded-full bg-slate-950 text hover:cursor-pointer z-30 disabled:cursor-not-allowed disabled:hover:cursor-not-allowed disabled:bg-zinc-700/40"
          onClick={() => useAnimationState.setState(() => ({ forceEnd: true }))}
        >
          <IoPlaySkipForward className="text-xl sm:text-2xl lg:text-3xl text-white" />
          <div
            className="absolute w-4 h-4 bg-white top-[52px] left-6 sm:top-14 sm:left-7 lg:left-[34px] lg:top-[62px]"
            style={{
              clipPath: `path("M 0 0 H 0 H 16 A 16 16 0 0 0 0 16 H 16 H 0 Z")`,
              transform: "rotate(90deg)",
            }}
          ></div>
          <div
            className="absolute w-4 h-4 bg-white top-1 right-11 sm:right-12 lg:right-[54px]"
            style={{
              clipPath: `path("M 0 0 H 0 H 16 A 16 16 0 0 0 0 16 H 16 H 0 Z")`,
              transform: "rotate(90deg)",
            }}
          ></div>
        </button>
      </div>
      {open && (
        <div className="absolute top-0 left-0 w-screen h-screen z-[1000] flex flex-col font-bold lg:flex-row items-center justify-evenly p-10 bg-black/80">
          <button
            className="absolute left-5 top-5 sm:top-7 sm:left-7 lg:top-10 lg:left-10 p-2 rounded-full bg-slate-950 hover:cursor-pointer z-30"
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
      )}
    </>
  );
};

export default Navigation;
