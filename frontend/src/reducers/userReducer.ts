import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_FAIL,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_AUTH_SET,
  USER_AUTH_RESET,
} from "@/constants/userConstants";

// Define types for the state
interface UserState {
  loading?: boolean;
  login?: string | object;
  token?: string | object | null;
  error?: string | object;
  details?: object | string;
}

interface Action {
  type: string;
  payload?: object | string;
}

const initialState: { token: string | null } = {
  token: localStorage.getItem("token"),
};

export const userAuthReducer = (
  state = initialState,
  action: Action
): { token: string | null } => {
  switch (action.type) {
    case USER_AUTH_SET:
      return { token: action.payload as string }; // Ensure payload is a string

    case USER_AUTH_RESET:
      return { token: null };

    default:
      return state;
  }
};

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
