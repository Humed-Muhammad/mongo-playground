import { DatabaseCollection } from "@/types";
import { MongoClient } from "mongodb";
import { useEffect, useState } from "react";

export const useMongo = (url: string) => {
  const database = localStorage.getItem("dbNameAndCollection");

  const [client, setClient] = useState<MongoClient>();

  const [dbNamesAndCollections, setDbNamesAndCollections] = useState<
    Array<DatabaseCollection>
  >(JSON.parse(database ?? ""));

  const cl = new MongoClient(url);
  useEffect(() => {
    const getMongoClient = async () => {
      const client = await cl.connect();
      setClient(client);
    };
    getMongoClient();
  }, [url]);

  useEffect(() => {
    const getDbsAndCols = async () => {
      if (client) {
        const adminDb = client.db("admin");

        const databaseList = await adminDb.admin()?.listDatabases();
        const allDbCols: Array<DatabaseCollection> = [];
        if (databaseList) {
          // Get the list of collections in each database
          for (const db of databaseList.databases) {
            const dbInstance = client.db(db.name);
            const collectionList = await dbInstance.listCollections().toArray();
            const collectionListName: Array<string> = [];
            collectionList.forEach((collection) => {
              collectionListName.push(collection.name);
            });

            allDbCols.push({
              [db.name]: collectionListName,
            });
          }
        }
        localStorage.setItem("dbNameAndCollection", JSON.stringify(allDbCols));
        setDbNamesAndCollections(allDbCols);
      }
    };
    getDbsAndCols();
  }, [client]);

  return {
    client,
    dbNamesAndCollections,
  };
};
