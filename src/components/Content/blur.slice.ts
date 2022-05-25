import { createSlice } from "@reduxjs/toolkit";

const blurSlice = createSlice({
  initialState: true,
  name: "blur",
  reducers: {
    blur: () => true,
  },
});

export default blurSlice.reducer;
export const { blur } = blurSlice.actions;
