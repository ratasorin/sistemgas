import React, { FC, MutableRefObject } from "react";

const GlowingPath: FC<{
  pathData: string;
  color: string;
  reference: MutableRefObject<SVGPathElement | null>;
}> = ({ pathData, color, reference }) => {
  return (
    <svg
      width="100vw"
      height="100vh"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
    >
      {/* Define the glow filter */}
      <defs>
        <filter
          id="line-glow"
          filterUnits="userSpaceOnUse"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur5" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur10" />

          <feMerge>
            <feMergeNode in="blur5" />
            <feMergeNode in="blur10" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Path with glow effect */}
      <path
        ref={reference}
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        filter="url(#line-glow)"
      />
    </svg>
  );
};

export default GlowingPath;
