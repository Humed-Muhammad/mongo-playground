import { RootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";

const initialState = (state: RootState) => state.mongoSlice;

export const selectPipelineName = createSelector(
  [initialState],
  (state) => state.pipelineName
);
