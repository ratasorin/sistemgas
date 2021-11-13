import { useState, useEffect } from "react";

// Define general type for useWindowSize hook, which includes width and height
interface Size {
  width: number | undefined;
  height: number | undefined;
}
const useElementSize = (element: HTMLDivElement): Size => {
  // Undefined initial state to avoid Server Side problems
  const [elementSize, setElementSize] = useState<Size>({
    width: undefined,
    height: undefined,
  });

  // Handler to call on window resize
  function handleResize() {
    // Set window width/height to state
    setElementSize({
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
    });
  }

  useEffect(() => {
    // Add event listener
    element.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => element.removeEventListener("resize", handleResize);
  }, []);

  return elementSize;
};
export default useElementSize;
