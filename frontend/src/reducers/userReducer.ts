import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_FAIL,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
} from "@/constants/userConstants";

// Define types for the state
interface UserState {
  loading?: boolean;
  login?: string;
  error?: string;
  details?: object;
}

interface Action {
  type: string;
  payload?: object;
}

export const userLoginReducer = (state = {}, action: Action): UserState => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, login: action.payload };
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const userDetailsReducer = (state = {}, action: Action): UserState => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { loading: true };
    case USER_DETAILS_SUCCESS:
      return { loading: false, details: action.payload };
    case USER_DETAILS_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
