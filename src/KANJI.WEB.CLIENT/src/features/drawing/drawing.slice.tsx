import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface DrawingSlice {
  predictions: number[];
}

const initialState: DrawingSlice = { predictions: [] };

export const drawingSlice = createSlice({
  name: 'drawing',
  initialState,
  reducers: {
    setPredicitons(state, action: PayloadAction<number[]>) {
      state.predictions = action.payload;
    },
  },
});

export const { setPredicitons } = drawingSlice.actions;
export default drawingSlice;
