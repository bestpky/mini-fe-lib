import { effectWatch } from "./reactivity/index.js";
import { mountElement,diff } from "./renderer/index.js";
export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const context = rootComponent.setup();
      let isMounted = false;
      let prevSubTree;

      effectWatch(() => {
        if (!isMounted) {
          isMounted = true
          rootContainer.innerHTML = ``;
          const subTree = rootComponent.render(context);
          mountElement(subTree, rootContainer);
          prevSubTree = subTree;

        } else {
          const subTree = rootComponent.render(context);
          diff(prevSubTree, subTree);
          prevSubTree = subTree;
        }
      });
    },
  };
}
