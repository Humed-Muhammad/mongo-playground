import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Card, CardHeader } from "../ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "../ui/accordion";
import { DatabaseCollection, Settings } from "@/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props {
  vscode: any;
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
  dbNamesAndCollections: DatabaseCollection[];
}

export const Sidebar = ({
  setSettings,
  vscode,
  dbNamesAndCollections,
}: Props) => {
  const [url, setUrl] = useState("mongodb://localhost:27017");
  useEffect(() => {
    vscode?.postMessage({
      command: "MongoDbUrl",
      url,
    });
  }, []);

  return (
    <div>
      <Card className=" overflow-y-scroll h-full flex w-64 flex-col items-center rounded-none border-b-0 border-l-0 border-r border-t-0 border-r-slate-600 bg-[#1E1E1E] p-4     text-white shadow-none">
        <div className="mb-3 flex flex-col space-y-3">
          <Label>MongoDB URL</Label>
          <div className="flex flex-col w-full items-center justify-between space-y-3">
            <Input
              value={url}
              className="h-8 rounded-sm bg-gray-300 text-gray-700"
              placeholder="MongoDb URL"
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button
              onClick={() => {
                setSettings((prev) => ({ ...prev, url }));
                vscode.postMessage({
                  command: "MongoDbUrl",
                  url,
                });
              }}
              className="bg-blue-500 rounded-sm h-8 w-full hover:bg-blue-400"
            >
              Apply
            </Button>
          </div>
        </div>
        <CardHeader className="text-left w-full p-0 text-lg mb-3">
          Database List
        </CardHeader>
        <Accordion
          type="single"
          defaultValue="item-1"
          collapsible
          className="w-full "
        >
          {dbNamesAndCollections?.map((db, id) => (
            <AccordionItem
              key={id}
              className="border-none"
              value={`item-${id}`}
            >
              <AccordionTrigger
                className="hover:bg-gray-100 h-8 hover:text-gray-700 p-2 mb-3"
                onClick={() =>
                  setSettings((prev) => ({ ...prev, dbName: "appDb" }))
                }
              >
                {Object.keys(db)[0]}
              </AccordionTrigger>
              {db?.[Object.keys(db)[0]].map((collection) => (
                <AccordionContent id={collection}>
                  <Button
                    className="w-full justify-start hover:opacity-25"
                    variant="ghost"
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        collectionName: "orders",
                      }))
                    }
                  >
                    {collection}
                  </Button>
                </AccordionContent>
              ))}
            </AccordionItem>
          ))}
          {/* <AccordionItem className="border-none" value="item-2">
            <AccordionTrigger
              className="hover:bg-gray-100 h-8 hover:text-gray-700 p-2 mb-3"
              onClick={() =>
                setSettings((prev) => ({ ...prev, dbName: "test" }))
              }
            >
              test
            </AccordionTrigger>
            <AccordionContent>
              <Button
                className="w-full justify-start hover:opacity-25"
                variant="ghost"
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    collectionName: "inventory",
                  }))
                }
              >
                inventory
              </Button>
            </AccordionContent>
            <AccordionContent>orders</AccordionContent>
          </AccordionItem> */}
        </Accordion>
      </Card>
    </div>
  );
};
