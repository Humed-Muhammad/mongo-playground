import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type {
  AllPipelinesType,
  DatabaseCollection,
  PipelineStoreType,
  Settings,
} from "@/types";
const webViewSetting = localStorage.getItem("mongodbSettings");
const currentQueryValue = localStorage.getItem("currentQuery");
const database = localStorage.getItem("dbNameAndCollection");
const localPipelineStore = localStorage.getItem("pipelineStore");

export interface MongoSliceQuery {
  dbNamesAndCollections: DatabaseCollection[] | undefined;
  settings: Partial<Settings>;
  allPipelinesFiles: AllPipelinesType[];
  queryResults: string | undefined;
  currentQuery: string;
  pipelineName: string;
  pipelineStore: PipelineStoreType;
  error: string | undefined;
}

const initialState: MongoSliceQuery = {
  dbNamesAndCollections: JSON.parse(database ?? "{}"),
  settings: JSON.parse(webViewSetting ?? "{}"),
  pipelineStore: JSON.parse(localPipelineStore ?? "{}"),
  currentQuery: JSON.parse(currentQueryValue ?? "[]"),
  allPipelinesFiles: [],
  queryResults: undefined,
  pipelineName: "Untitled",
  error: undefined,
};

export const counterSlice = createSlice({
  name: "mongoSlice",
  initialState,
  reducers: {
    // setInitialStates: (state, action: PayloadAction<>) => {},
    setPipelineName: (state, action: PayloadAction<string>) => {
      state.pipelineName = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const actions = counterSlice.actions;

export default counterSlice.reducer;
