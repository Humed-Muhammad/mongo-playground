import { MongoClient } from "mongodb";
type Options = {
  dataBaseName: string;
  url: string;
};
export const createNewDatabase = async ({ dataBaseName, url }: Options) => {
  const mongoClient = new MongoClient(url);
  const client = await mongoClient.connect();
  try {
    const db = client.db(dataBaseName);
    return db;
  } catch (error) {
    throw error;
  } finally {
    await client.close();
  }
};
