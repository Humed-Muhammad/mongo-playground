import type { MongoClient } from "mongodb";

export interface Settings {
  url: string;
  theme: "vs-dark" | "vs-light";
  dbName: string;
  collectionName: string;
  query: string | undefined;
  mongoClient?: MongoClient | undefined;
}

export interface DatabaseCollection {
  [dbName: string]: Array<string>;
}

export interface PipelineStoreType {
  [key: string]: string | undefined;
}

export type AllPipelinesType = {
  value: string;
  label: string;
};
