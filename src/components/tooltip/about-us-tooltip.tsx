import dynamic from "next/dynamic";
import React, { FC } from "react";
import { createPortal } from "react-dom";
import { MdCheck } from "react-icons/md";

export type AboutUsTooltipProps = {
  elementId: string;
};

const AboutUsTooltip: FC<AboutUsTooltipProps> = ({ elementId }) => {
  return createPortal(
    <div
      id={`tooltip-${elementId}`}
      className="border border-slate-400/30 bg-white/40 backdrop-blur-md p-3 max-w-xs rounded-xl text-center mb-3 text-gray-900"
    >
      <div className="px-3 py-2 bg-white rounded-lg font-poppins text-sm max-w-md mb-2 border border-slate-200 ">
        🎉 Bine ati venit pe site-ul nostru! 👋🏻
        <br />
        Incearca noua experienta{" "}
        <span className="font-bold text-blue-900">SISTEMGAS</span>
        <br />
      </div>
      <div className="px-3 py-2 bg-white rounded-lg font-poppins text-sm max-w-md border border-slate-200 mb-2">
        Cand este apasata, fiecare pictograma va dezvalui o parte din povestea
        noastra
      </div>

      <div className="px-3 py-2 bg-white rounded-lg font-poppins text-sm max-w-md border border-slate-200 flex flex-col">
        Eu iti pot oferi:
        <button className="border border-slate-300 px-3 py-1 rounded-md uppercase font-semibold text-slate-900 mt-1">
          Detalii despre noi
        </button>
      </div>
    </div>,
    document.body
  );
};

export default AboutUsTooltip;
