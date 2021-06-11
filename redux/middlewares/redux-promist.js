export default function promiseMiddleware({ dispatch }) {
  return next => action => {
    if (!isFSA(action))  {      
      return isPromise(action)
        ? action.then(dispatch)
        : next(action);
    }

    return isPromise(action.payload)
      ? action.payload.then(
          result => dispatch({ ...action, payload: result }),
          error => {
            dispatch({ ...action, payload: error, error: true });
            return Promise.reject(error);
          }
        )
      : next(action);
  };
}


function isPromise(action) {
  return action instanceof Promise
} 

// 判断是否是标准的 flux action
function isFSA(action) {
  return typeof action.type === 'string' && isPromise(action.payload)
}

// 用法
// const FETCH_DATA = 'FETCH_DATA'
// action creator
// const getData = function(id) {
//     return {
//         type: FETCH_DATA,
//         payload: api.fetchData(id) // 直接将 promise 作为 payload
//     }
// }
// //reducer
// const reducer = function(oldState, action) {
//     switch(action.type) {
//     case FETCH_DATA: 
//         if (action.status === 'success') {
//              // 更新 store 等处理
//         } else {
//                 // 提示异常
//         }
//     }
// }