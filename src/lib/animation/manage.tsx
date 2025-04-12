import React, { createContext, useCallback, useContext } from "react";

const _ANIMATIONS = {
  // when the car finishes it's animation (naturally or due to skip) do the following in parallel: 
  car: [
    "pill", // animate the pill going up
    "skip-pill", // force the pill up
    "hit-breaks", // animte the road/background stopping
    "skip-hit-breaks", // force stop the road/background 
    "reveal-hq", // bring the hq in the main view
    "skip-reveal-hq", // force the hq in the main view
  ],
  pill: ["bubbles"],
  "skip-pill": ["skip-bubbles"],
  "hit-breaks": [],
  "reveal-hq": [],
  "skip-reveal-hq": [],
  "skip-hit-breaks": [],
  bubbles: ["pipes"],
  "skip-bubbles": ["skip-pipes"],
  "skip-pipes": [],
  pipes: [],
} as const;

type AnimationKey = keyof typeof _ANIMATIONS;

type ValidAnimation<T extends Record<AnimationKey, readonly AnimationKey[]>> = {
  [K in keyof T]: T[K] extends readonly []
    ? readonly [] // ✅ Allow empty arrays
    : T[K] extends readonly (infer V)[]
    ? readonly V[]
    : never;
};

// Apply validation
export const ANIMATIONS: ValidAnimation<typeof _ANIMATIONS> = _ANIMATIONS;

type AnimationFunction<P extends AnimationKey> = (
  duration: number | undefined,
  triggerNext: number | undefined
) => Promise<(typeof ANIMATIONS)[P]>;

interface AnimationInstance<P extends AnimationKey> {
  duration?: undefined | number;
  triggerNext?: undefined | number;
  timeout?: number;
  animation?: AnimationFunction<P>[] | undefined;
}

const ImplementedAnimations: {
  [P in AnimationKey]: AnimationInstance<P>;
} = {
  car: {},
  pill: {
    duration: 1500,
  },
  "skip-pill": {
    duration: 0,
  },
  "hit-breaks": {
    duration: 1500,
  },
  "reveal-hq": {
    duration: 1500,
  },
  "skip-reveal-hq": {
    duration: 0,
  },
  "skip-hit-breaks": {
    duration: 0,
  },
  bubbles: {
    duration: 700,
  },
  "skip-bubbles": {
    duration: 0,
  },
  "skip-pipes": {
    duration: 0,
  },
  pipes: {
    duration: 700,
  },
};


export const createAnimationImplementation = <P extends AnimationKey>(
  animationId: P,
  implementation: AnimationFunction<P>,
  stack: boolean = false
) => {
  if(!ImplementedAnimations[animationId].animation) ImplementedAnimations[animationId].animation = [implementation];
  
  if(stack) {
    ImplementedAnimations[animationId].animation.push(implementation);
  }
  else {
    ImplementedAnimations[animationId].animation = [implementation];
  }
};

const animationRunner = (startAnimationId: AnimationKey) => {
  const { animation, duration, triggerNext } =
    ImplementedAnimations[startAnimationId];
  
  if (animation) {
    Promise.all(animation.map(an => an(duration, triggerNext))).then(next => {
      const distinctNext = [...new Set(next.flat())];
      distinctNext.forEach((id) => {
        animationRunner(id);
      });
    });
  } else
    throw new Error(
      `No implementation provided for: ${startAnimationId} animation`
    );
};

interface AnimationContextType {
  startAnimation: (animationId: AnimationKey) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined
);

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const startAnimation = useCallback((animationId: AnimationKey) => {
    animationRunner(animationId);
  }, []);

  return (
    <AnimationContext.Provider value={{ startAnimation }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimationManager = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error(
      "useAnimationManager must be used within an AnimationProvider"
    );
  }
  return context;
};
