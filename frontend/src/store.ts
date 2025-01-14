import { configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import { userLoginReducer, userDetailsReducer,userAuthReducer } from "./reducers/userReducer";
import { workspaceDetailsReducer,workspaceCreateReducer } from "./reducers/workspaceReducer";

const store = configureStore({
  reducer: {
    userAuth:userAuthReducer,
    userLogin: userLoginReducer,
    userDetails: userDetailsReducer,
    workspaceDetails: workspaceDetailsReducer,
    workspaceCreate:workspaceCreateReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});



export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
