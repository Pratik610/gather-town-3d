import axios from "axios";
import {
  WORKSPACE_CREATE_REQUEST,
  WORKSPACE_CREATE_FAIL,
  WORKSPACE_CREATE_SUCCESS,
  GET_ALL_WORKSPACE_FAIL,
  GET_ALL_WORKSPACE_REQUEST,
  GET_ALL_WORKSPACE_SUCCESS,
} from "../constants/workspaceConstants";
import { Dispatch } from "redux";

export const createWorkSpace =
  (name: string, description: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: WORKSPACE_CREATE_REQUEST,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/workspace/create`,
        {
          name,
          description,
        },
        config
      );

      dispatch({
        type: WORKSPACE_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: WORKSPACE_CREATE_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

export const getAllWorkSpace = () => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: GET_ALL_WORKSPACE_REQUEST,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/v1/workspace`,
      config
    );

    dispatch({
      type: GET_ALL_WORKSPACE_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: GET_ALL_WORKSPACE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
