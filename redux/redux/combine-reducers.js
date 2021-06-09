export default function combineReducers(reducersMap) {
    /*返回合并后的新的reducer函数*/
    return function newReducer(state = {}, action) {
      // 总的state
      const nextState = {}
      // 遍历执行所有的reducers，整合成为一个新的state
      Object.keys(reducersMap).forEach(key => {
        const reducer = reducersMap[key]
        // 之前的 key 的 state
        const previousStateForKey = state[key]
        //执行 分 reducer，获得新的state
        const nextStateForKey = reducer(previousStateForKey, action)
        nextState[key] = nextStateForKey
      })
      return nextState;
    }
  }