import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth";
import profileReducer from "./features/profile";
import familyReducer from "./features/family";
import educationReducer from "./features/education";
import extracurricularReducer from "./features/extracurricular";
import applicationReducer from "./features/application";
import { clearDataOnLogout } from "./middleware/clearDataOnLogout";
import universitiesReducer from "./slices/universitiesSlice";
import { Middleware, AnyAction } from "@reduxjs/toolkit";

// Persist universities picks to localStorage so session changes are maintained
const persistUniversities: Middleware<{}, unknown> = (api) => (next) => (action) => {
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
        universities: universitiesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(clearDataOnLogout, persistUniversities),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create typed hooks
export type { TypedUseSelectorHook } from 'react-redux';
