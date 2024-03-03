import { MongoClient } from "mongodb";

export async function executeAggregationQuery(
  client: MongoClient,
  query: string,
  dbName: string,
  collectionName: string
): Promise<any> {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  try {
    const pipeline = JSON.parse(query);
    const results = await collection.aggregate(pipeline).toArray();

    return results;
  } catch (error) {
    throw error;
  } finally {
    await client.close();
  }
}
