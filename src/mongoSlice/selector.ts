import { RootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";

const initialState = (state: RootState) => state.mongoSlice;

export const selectPipelineName = createSelector(
  [initialState],
  (state) => state.pipelineName
);

export const selectAllPipelinesFiles = createSelector(
  [initialState],
  (state) => state.allPipelinesFiles
);

export const selectCurrentQuery = createSelector(
  [initialState],
  (state) => state.currentQuery
);

export const selectDbNamesAndCollections = createSelector(
  [initialState],
  (state) => state.dbNamesAndCollections
);

export const selectError = createSelector(
  [initialState],
  (state) => state.error
);

export const selectPipelineStore = createSelector(
  [initialState],
  (state) => state.pipelineStore
);
export const selectQueryResults = createSelector(
  [initialState],
  (state) => state.queryResults
);
export const selectSettings = createSelector(
  [initialState],
  (state) => state.settings
);
