import { effectWatch } from "./reactivity/index.js";
import { mountElement,diff } from "./renderer/index.js";
export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const context = rootComponent.setup();
      let isMounted = false;
      let prevSubTree;

      effectWatch(() => {
        const subTree = rootComponent.render(context);
        if (!isMounted) {
          isMounted = true
          rootContainer.innerHTML = ``;
          mountElement(subTree, rootContainer);
          prevSubTree = subTree;

        } else {
          diff(prevSubTree, subTree);
          prevSubTree = subTree;
        }

      });
    },
  };
}
