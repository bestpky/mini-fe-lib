const thunk = ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }
  return next(action);
};

// 样板代码
// const createFetchDataAction = function(id) {
//   return function(dispatch, getState) {
//       dispatch({
//           type: FETCH_DATA_START, 
//           payload: id
//       })
//       api.fetchData(id) 
//           .then(response => {
//               dispatch({
//                   type: FETCH_DATA_SUCCESS,
//                   payload: response
//               })
//           })
//           .catch(error => {
//               dispatch({
//                   type: FETCH_DATA_FAILED,
//                   payload: error
//               })
//           }) 
//   }
// }
// //reducer
// const reducer = function(oldState, action) {
//   switch(action.type) {
//   case FETCH_DATA_START : 
//       // 处理 loading 等
//   case FETCH_DATA_SUCCESS : 
//       // 更新 store 等处理
//   case FETCH_DATA_FAILED : 
//       // 提示异常
//   }
// }