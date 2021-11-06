import { NextPage } from "next";
import { createContext, ReactNode, useState } from "react";

interface AnimationDetails {
  timesAnimated: number;
  animate: boolean;
}

export const AnimationContext = createContext(
  [] as unknown as [
    AnimationDetails,
    (AnimationDetails: AnimationDetails) => void
  ]
);

export const AnimationProvider: NextPage<ReactNode> = ({ children }) => {
  const [AnimationTriggers, setAnimationTriggers] = useState<AnimationDetails>({
    timesAnimated: 0,
    animate: true,
  });
  return (
    <AnimationContext.Provider
      value={[AnimationTriggers, setAnimationTriggers]}
    >
      {children}
    </AnimationContext.Provider>
  );
};
