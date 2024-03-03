import { MongoClient } from "mongodb";

export async function executeAggregationQuery(
  query: string,
  url: string
): Promise<any> {
  const client = new MongoClient(url);
  await client.connect();

  const db = client.db("test");
  const collection = db.collection("orders");

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
