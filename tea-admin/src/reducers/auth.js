import { USER_LOGIN } from "../constant";

const initState = {
  isLogin: false,
  username: "",
  password: ""
};

const auth = (state = initState, action) => {
  switch (action.type) {
    case USER_LOGIN:
      return {
        ...state,
        username: action.payload.username,
        password: action.payload.password,
        isLogin: true
      };

    default:
      return state;
  }
};

export default auth
