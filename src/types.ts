export interface Settings {
  url: string;
  theme: string;
  dbName: string;
  collectionName: string;
  query: string | undefined;
}

export interface DatabaseCollection {
  [dbName: string]: Array<string>;
}
