import {
  WORKSPACE_CREATE_REQUEST,
  WORKSPACE_CREATE_FAIL,
  WORKSPACE_CREATE_SUCCESS,
  GET_ALL_WORKSPACE_FAIL,
  GET_ALL_WORKSPACE_REQUEST,
  GET_ALL_WORKSPACE_SUCCESS,
  WORKSPACE_CREATE_RESET
} from "../constants/workspaceConstants";

interface Action {
  type: string;
  payload?: object;
}

export const workspaceCreateReducer = (state = {}, action: Action): any => {
  switch (action.type) {
    case WORKSPACE_CREATE_REQUEST:
      return { loading: true };
    case WORKSPACE_CREATE_SUCCESS:
      return { loading: false, workspaceStatus: action.payload };
    case WORKSPACE_CREATE_FAIL:
      return { loading: false, error: action.payload };
  case WORKSPACE_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const workspaceDetailsReducer = (state = {}, action: Action): any => {
  switch (action.type) {
    case GET_ALL_WORKSPACE_REQUEST:
      return { loading: true };
    case GET_ALL_WORKSPACE_SUCCESS:
      return { loading: false, workspaces: action.payload };
    case GET_ALL_WORKSPACE_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
