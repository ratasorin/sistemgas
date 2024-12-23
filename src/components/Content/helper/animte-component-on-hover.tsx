import tippy, { DelegateInstance, Props } from "tippy.js";
import content from "../content.module.css";
import { shouldExit, updateLastElementHovered } from "lib/debounce-hover";

export let poppers: DelegateInstance<Props>[] = [];
export const actions = (
  component: HTMLElement,
  props: { shadowBlur1: number; shadowBlur2: number }
) => {
  const { shadowBlur1, shadowBlur2 } = props;
  component.classList.add(content["svg-original"]);
  component.style.setProperty("--shadow-blur-1", `${shadowBlur1}px`);
  component.style.setProperty("--shadow-blur-2", `${shadowBlur2}px`);

  component.addEventListener("mouseenter", () => {
    updateLastElementHovered(component, {
      effect: (currentElementHovered) => {
        currentElementHovered?.classList.add(content["svg-hover"]);
        const popper = poppers.find(
          (popper) => popper.reference === currentElementHovered
        );

        // this one might be problematic because if the "should exit" method is enabled before, the popover is not applied!
        setTimeout(() => {
          popper?.show();
        }, 200);
      },
      cleanup: (lastElementHovered) => {
        lastElementHovered?.classList.remove(content["svg-hover"]);
        const popper = poppers.find(
          (popper) => popper.reference === lastElementHovered
        );
        popper?.hide();
      },
    });
  });

  component.addEventListener("mouseleave", () => {
    shouldExit(component, (element) => {
      element.classList.remove(content["svg-hover"]);
      const popper = poppers.find((popper) => popper.reference === element);
      popper?.hide();
    });
  });
  // TODO: Fix touch outside not working on mobile!
};

export const animateComponentOnHover = <T,>(
  componentId: string,
  options: Partial<Props>,
  actions: (el: HTMLElement, props: T) => void,
  props: T
) => {
  const component = document.getElementById(componentId);
  if (!component) {
    console.error(`There is no component with id: ${componentId}!`);
    return;
  }

  const popper = tippy(`#${componentId}`, options);
  poppers = [...poppers, ...popper];

  actions(component, props);
};
