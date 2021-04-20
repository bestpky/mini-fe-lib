import React, { useContext, useRef, useReducer, useLayoutEffect } from 'react';
import ReactReduxContext from './context';
import shallowEqual from './shallowEqual';

function storeStateUpdatesReducer(count) {
  return count + 1;
}

// 第一层函数接收mapStateToProps和mapDispatchToProps
function connect(mapStateToProps = () => {},  mapDispatchToProps = () => {}) {
  function childPropsSelector(store, wrapperProps) {
    const state = store.getState();   // 拿到state

    // 执行mapStateToProps和mapDispatchToProps
    const stateProps = mapStateToProps(state);
    const dispatchProps = mapDispatchToProps(store.dispatch);

    return Object.assign({}, stateProps, dispatchProps, wrapperProps);
  }
  // 第二层函数是个高阶组件，里面获取context
  // 然后执行mapStateToProps和mapDispatchToProps
  // 再将这个结果组合用户的参数作为最终参数渲染WrappedComponent
  // WrappedComponent就是我们使用connext包裹的自己的组件
  return function connectHOC(WrappedComponent) {

    function ConnectFunction(props) {
      // 复制一份props到wrapperProps
      const { ...wrapperProps } = props;

      // 获取context的值
      const context = useContext(ReactReduxContext);

      // 解构出store和parentSub
      const { store, subscription: parentSub } = context;  

      // 组装最终的props
      const actualChildProps = childPropsSelector(store, wrapperProps)

      // 记录上次渲染参数
      const lastChildProps = useRef();
      // 使用useLayoutEffect保证同步执行
      useLayoutEffect(() => {
        lastChildProps.current = actualChildProps;
      }, [actualChildProps]);

      // 使用useReducer触发强制更新
      const [
        ,
        forceComponentUpdateDispatch
      ] = useReducer(storeStateUpdatesReducer, 0)
      // 注册回调
      store.subscribe(() => {
        const newChildProps = childPropsSelector(store, wrapperProps);
        if(!shallowEqual(newChildProps, lastChildProps.current)) {
          lastChildProps.current = newChildProps;
          forceComponentUpdateDispatch();
        }
      });

      // 渲染WrappedComponent
      return <WrappedComponent {...actualChildProps} />
    }

    return ConnectFunction;
  }
}

export default connect;
