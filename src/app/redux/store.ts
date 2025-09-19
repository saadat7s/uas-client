import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth";
import profileReducer from "./features/profile";
import familyReducer from "./features/family";
import educationReducer from "./features/education";
import extracurricularReducer from "./features/extracurricular";
import applicationReducer from "./features/application";
import { clearDataOnLogout } from "./middleware/clearDataOnLogout";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        family: familyReducer,
        education: educationReducer,
        extracurricular: extracurricularReducer,
        application: applicationReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(clearDataOnLogout),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create typed hooks
export type { TypedUseSelectorHook } from 'react-redux';
