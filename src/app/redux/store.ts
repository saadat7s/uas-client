import { configureStore, Middleware } from "@reduxjs/toolkit";
import authReducer from "./features/auth";
import profileReducer from "./features/profile";
import familyReducer from "./features/family";
import educationReducer from "./features/education";
import extracurricularReducer from "./features/extracurricular";
import applicationReducer from "./features/application";
import universityAdminReducer from "./features/universityAdmin";
import { clearDataOnLogout } from "./middleware/clearDataOnLogout";
import universitiesReducer from "./slices/universitiesSlice";

// Persist universities picks to localStorage so session changes are maintained
const persistUniversities: Middleware = (api) => (next) => (action) => {
    const result = next(action);
    try {
        const state: any = api.getState();
        const uniState = state?.universities;
        if (uniState) {
            localStorage.setItem("pcas:universities:picks", JSON.stringify(uniState.picks));
        }
    } catch {}
    return result;
};

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        family: familyReducer,
        education: educationReducer,
        extracurricular: extracurricularReducer,
        application: applicationReducer,
        universityAdmin: universityAdminReducer,
        universities: universitiesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(clearDataOnLogout, persistUniversities),
}) as any;

export type RootState = any;
export type AppDispatch = any;

// Create typed hooks
export type { TypedUseSelectorHook } from 'react-redux';
