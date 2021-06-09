/**
 * 应用中间件：重写createStore的dispatch方法
 * @param  {...any} middlewares 
 * @returns {function}
 */
const applyMiddleware = function (...middlewares) {
    return function (oldCreateStore) {
      return function newCreateStore(reducer) {
        const store = oldCreateStore(reducer);
        // 给每个中间件注入store
        const chain = middlewares.map(middleware => middleware(store));
        // 实现 exception(time((logger(dispatch))))
        const newDispatch = chain.reverse().reduce((memo, middleware) => {
          memo = middleware(memo);
          return memo
        }, store.dispatch);
        store.dispatch = newDispatch;
        return store;
      }
    }
  }
  
  export default applyMiddleware