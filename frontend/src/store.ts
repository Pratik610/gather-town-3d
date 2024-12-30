import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { userLoginReducer, userDetailsReducer } from "./reducers/userReducer";
import { workspaceDetailsReducer,workspaceCreateReducer } from "./reducers/workspaceReducer";

const store = configureStore({
  reducer: {
    userLogin: userLoginReducer,
    userDetails: userDetailsReducer,
    workspaceDetails: workspaceDetailsReducer,
    workspaceCreate:workspaceCreateReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type AppDispatch = typeof store.dispatch;

export default store;
