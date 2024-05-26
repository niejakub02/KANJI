import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Tab = 'draw' | 'community' | 'settings' | 'reports';

interface GlobalState {
  selectedTab: Tab;
}

const initialState: GlobalState = {
  selectedTab: 'draw',
};

export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    selectTab(state, action: PayloadAction<Tab>) {
      state.selectedTab = action.payload;
    },
  },
});

export const { selectTab } = globalSlice.actions;
export default globalSlice;
