let initState = {
    name: '前端开发',
    description: '复制粘贴工程师',
}
  
export default function InfoReducer(state, action) {
  if (!state) {
    state = initState;
  }
  switch (action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: action.name
      }
    case 'SET_DESCRIPTION':
      return {
        ...state,
        description: action.description
      }
    default:
      return state;
  }
}