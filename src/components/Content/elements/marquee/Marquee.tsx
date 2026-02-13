"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAnimationState } from "../../Scene/Car/Car";
import About from "../about/About";

const IMAGES = [
  "/marquee/zoppas.png",
  "/marquee/eurocooper.webp",
  "/marquee/MAHLE.png",
  "/marquee/smithfield.jpg",
  "/marquee/ursus.jpg",
];

const Marquee = () => {
  const { finished } = useAnimationState();

  return (
    <AnimatePresence>
      {finished && (
        <motion.div  
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }} 
          className="pt-[12.5vh] relative w-full bg-gradient-to-b from-transparent to-white to-[12.5vh]">
          <div className="bg-[radial-gradient(circle_at_50%_120%,_var(--tw-gradient-stops))] from-gray-500 via-white to-white opacity-60 flex flex-col">

        <div
          className="relative  left-0 w-full overflow-hidden z-30 py-6 bg-white/10 backdrop-blur-[2px] border-y border-white/20"
          >
          <div className="flex flex-col items-center mb-4">
            <span className="text-slate-900/50 font-semibold text-sm uppercase">
              Trusted by:
            </span>
          </div>
          <div className="relative flex overflow-x-hidden">
            <motion.div
              className="flex whitespace-nowrap min-w-max"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                duration: 25,
                ease: "linear",
                repeat: Infinity,
              }}
              >
              {[...IMAGES, ...IMAGES].map((src, index) => (
                <div
                key={index}
                className="flex-shrink-0 px-12 flex items-center justify-center"
                >
                  <img
                    src={src}
                    alt="Partner"
                    className="h-14 md:h-20 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                    />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
          <About />

              </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Marquee;
