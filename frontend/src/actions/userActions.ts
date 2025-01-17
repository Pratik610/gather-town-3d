import axios from "axios";
import {
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_AUTH_SET,
} from "@/constants/userConstants";
import { RootState } from "@/store"; 
import { Dispatch, } from "redux";
export const googleLogin =
  (access_token: string, loginType: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: USER_LOGIN_REQUEST,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      // Replace with actual API call
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/user/login`,
        {
          access_token,
          loginType,
        },

        config
      );

      localStorage.setItem("token", data.token);

      dispatch({
        type: USER_AUTH_SET,
        payload: data.token,
      });

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

export const getUserDetails =
  () => async (dispatch: Dispatch, getState:()=> RootState ) => {
    try {
      const {
        userAuth: { token },
      } = getState();

      dispatch({
        type: USER_DETAILS_REQUEST,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      // Replace with actual API call
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/`,
        config
      );

      dispatch({
        type: USER_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: USER_DETAILS_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
