"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAnimationState } from "../../Scene/Car/Car";

const About = () => {
  const { finished } = useAnimationState();

  return (
    <AnimatePresence>
      {finished && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-30 pb-20 px-3 max-w-4xl mx-auto text-left"
        >
          <div className="p-8 md:p-12">
            <p className="font-poppins text-slate-950 text-lg md:text-xl leading-relaxed mb-12">
              "Sistemgas este o societate romano-italiana, infiintata in anul
              1994, avand ca obiect principal de activitate distributia de Gaz
              Petrolier Lichefiat GPL. Managementul performant aplicat, echipa
              de specialisti, precum si preocuparea permanenta a acestora pentru
              calitatea executiei instalatiilor, protectiei mediului si
              satisfactiei clientilor au reusit in scurt timp sa impuna
              SISTEMGAS intr-o pozitie cheie pe piata de specialitate."
            </p>

            <div className="flex flex-col items-center md:items-end mt-8">
              <div className="text-right">
                
                <span className="block text-slate-950/50 font-medium text-lg">
                  Dr. ing.
                </span>
                <span className="block font-bold text-slate-950 text-xl md:text-2xl">
                  Dan Alexandru
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default About;
