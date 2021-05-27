// 创建一个虚拟节点 vdom vnode
export function h(tag, _propsOrChildren, _children) {
  let children, props
    if (_children) {
      props = _propsOrChildren
      children = _children
    }else {
      if (typeof _propsOrChildren === 'string' || Array.isArray(_propsOrChildren)) {
        props = null
        children = _propsOrChildren
      }else {
        props = _propsOrChildren
        children = null
      }
    }
    return {
      tag,
      props,
      children,
    };
  }
  