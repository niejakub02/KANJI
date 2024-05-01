import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { removeTokensFromStorage } from '@utils/authUtils';
import { User } from '@utils/types';

interface AuthState {
  user: User | null;
}

const initialState: AuthState = { user: null };

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    signOut(state) {
      removeTokensFromStorage();
      state.user = null;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice;
