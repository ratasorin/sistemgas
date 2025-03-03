import { useId, useMemo } from "react";

import { cn } from "lib/utils";

interface GridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: string;
  squareFillProbability?: number; // Probability of filling each square
  className?: string;
  [key: string]: unknown;
}

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  squareFillProbability = 0.2, // 20% chance to fill a square
  className,
  ...props
}: GridPatternProps) {
  const id = useId();

  // Generate random squares on first render
  const squares = useMemo(() => {
    const cols = Math.ceil(window.innerWidth / width); // Adjust this to match container size
    const rows = Math.ceil(window.innerHeight / 2 / height);
    const generatedSquares: Array<[number, number]> = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (Math.random() < squareFillProbability) {
          generatedSquares.push([j, i]);
        }
      }
    }

    return generatedSquares;
  }, [width, height, squareFillProbability]);

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-sky-50/60 stroke-gray-50/60",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares.length > 0 && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width - 1}
              height={height - 1}
              x={x * width + 1}
              y={y * height + 1}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
