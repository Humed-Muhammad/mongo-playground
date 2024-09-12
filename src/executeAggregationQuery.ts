import { MongoClient } from "mongodb";
import JSON5 from "json5";

export async function executeAggregationQuery(
  url: string,
  query: string,
  dbName: string,
  collectionName: string
): Promise<any> {
  const mongoClient = new MongoClient(url);
  const client = await mongoClient.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  try {
    const pipeline = JSON5.parse(query);
    const results = await collection.aggregate(pipeline).toArray();

    return results;
  } catch (error) {
    throw error;
  } finally {
    await client.close();
  }
}
