import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type {
  AllPipelinesType,
  DatabaseCollection,
  PipelineStoreType,
  Settings,
} from "@/types";
import { settingsInitial } from "@/constants";
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
  dbNamesAndCollections: JSON.parse(database ?? "[]"),
  settings: JSON.parse(webViewSetting ?? "{}")?? settingsInitial,
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
    setCurrentQuery: (state, action: PayloadAction<string>) => {
      state.currentQuery = action.payload;
    },
    setSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      state.settings = {...state.settings, ...action.payload};
    },
    setQueryResults: (state, action: PayloadAction<string>) => {
      state.queryResults = action.payload;
    },
    setPipelineStore: (state, action: PayloadAction<PipelineStoreType>) => {
      state.pipelineStore = {...state.pipelineStore, ...action.payload};
    },
    setDbNamesAndCollections: (
      state,
      action: PayloadAction<DatabaseCollection[]>
    ) => {
      state.dbNamesAndCollections = action.payload;
    },
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
    },
    setAllPipelinesFiles: (state, action: PayloadAction<AllPipelinesType[]>) => {
      state.allPipelinesFiles = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const actions = counterSlice.actions;

export default counterSlice.reducer;
