import { combineReducers } from '@reduxjs/toolkit';
import { kanjiApi } from './api';
import authSlice from '@features/auth/auth.slice';
import globalSlice from '@features/global/global.slice';

export const rootReducer = combineReducers({
  [kanjiApi.reducerPath]: kanjiApi.reducer,
  auth: authSlice.reducer,
  global: globalSlice.reducer,
});

export default rootReducer;
