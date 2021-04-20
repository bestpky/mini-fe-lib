import React from 'react';
import ReactReduxContext from './context';

export default function Provider(props) {
  const {store, children} = props;

  // 这是要传递的context
  const contextValue = { store };

  // 返回ReactReduxContext包裹的组件，传入contextValue
  // 里面的内容就直接是children，我们不动他
  return (
    <ReactReduxContext.Provider value={contextValue}>
      {children}
    </ReactReduxContext.Provider>
  )
}
