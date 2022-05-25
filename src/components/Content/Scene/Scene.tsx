import { useAppSelector } from "hooks/redux";
import type { NextPage } from "next";
import Canvas from "./Canvas/Canvas";

export interface Render {
  render: () => void;
  update: () => void;
  blur?: boolean;
}

const Scene: NextPage<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const blur = useAppSelector(({ blur }) => blur);
  return (
    <div className='relative w-full flex-1 overflow-hidden z-10'>
      <div className='absolute w-full h-full z-20 overflow-hidden'>
        <Canvas width={width} height={height} toDraw='text'></Canvas>
      </div>
      <div
        className={`absolute w-full h-full z-20 overflow-hidden ${
          blur ? "blur-md z-0" : ""
        }`}>
        <Canvas width={width} height={height} toDraw='car'></Canvas>
      </div>
    </div>
  );
};

export default Scene;
