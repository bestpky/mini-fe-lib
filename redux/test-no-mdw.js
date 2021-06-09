import { createStore, combineReducers } from './redux';
import infoReducer from './reducers/info'

const reducer = combineReducers({
  info: infoReducer
})

const store = createStore(reducer)

store.subscribe(() => {
  let state = store.getState();
  console.log(state.info.name);
});

store.dispatch({
  type: 'SET_NAME',
  name: 'nmsl'
});