import { combineReducers } from '@reduxjs/toolkit';
import { kanjiApi } from './api';
import authSlice from '@features/auth/auth.slice';

export const rootReducer = combineReducers({
  [kanjiApi.reducerPath]: kanjiApi.reducer,
  auth: authSlice.reducer,
});

export default rootReducer;
