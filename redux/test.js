import { createStore, combineReducers, applyMiddleware } from './redux';
import counterReducer from './reducers/counter';
import infoReducer from './reducers/info';

import loggerMiddleware from './middlewares/logger';
import exceptionMiddleware from './middlewares/exception';


const reducer = combineReducers({
  counter: counterReducer,
  info: infoReducer
});

/*接收旧的 createStore，返回新的 createStore*/
const rewriteCreateStoreFunc = applyMiddleware(exceptionMiddleware, loggerMiddleware);

/*返回了一个 dispatch 被重写过的 store*/
const store = createStore(reducer, rewriteCreateStoreFunc);

store.subscribe(() => {
  let state = store.getState();
  console.log(state.counter.count);
  console.log(state.info.name);
});

store.dispatch({
  type: 'INCREMENT'
});
// store.dispatch({
//   type: 'DECREMENT'
// });

// store.dispatch({
//   type: 'SET_NAME',
//   name: 'nmsl'
// });