/**
 * createStore
 * @param {function} reducer (state, action) => newState  
 * @param {function} rewriteCreateStoreFunc 重写createStore的方法
 * @returns 
 */
export default function createStore(reducer, rewriteCreateStoreFunc) {

    if (rewriteCreateStoreFunc) {
      const newCreateStore = rewriteCreateStoreFunc(createStore);
      return newCreateStore(reducer);
    }
  
    let state = {};
    let listeners = [];
  
    function subscribe(listener) {
      listeners.push(listener);
    }
  
    function dispatch(action) {
      state = reducer(state, action);
      for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i];
        listener();
      }
    }
  
    function getState() {
      return state;
    }
    
    // 初始化state
    dispatch({ type: Symbol() });
  
    return {
      subscribe,
      dispatch,
      getState
    }
  }