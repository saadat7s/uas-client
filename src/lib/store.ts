import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import applicationReducer from "./features/applicationSlice";
import universitiesReducer from "./features/universitiesSlice";
import programReducer from "./features/programSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    application: applicationReducer,
    universities: universitiesReducer,
    program: programReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
