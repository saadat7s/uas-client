import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { clearAllProfileData } from '../features/profile';
import { clearAllFamilyData } from '../features/family';
import { clearAllEducationData } from '../features/education';
import { clearAllExtracurricularData } from '../features/extracurricular';
import { resetApplication } from '../features/application';

export const clearDataOnLogout: Middleware<{}, RootState> = (store) => (next) => (action) => {
  // Check if the action is a logout action
  if (action.type === 'auth/logout' || action.type === 'auth/logoutUser/fulfilled') {
    // Clear all application data from Redux store
    store.dispatch(clearAllProfileData());
    store.dispatch(clearAllFamilyData());
    store.dispatch(clearAllEducationData());
    store.dispatch(clearAllExtracurricularData());
    store.dispatch(resetApplication());
  }
  
  return next(action);
};
