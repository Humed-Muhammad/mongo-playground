import { useCallback, useEffect, useMemo, useState } from "react";
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
import { Database, Folder, Moon, Sun } from "lucide-react";

import { Switch } from "../ui/switch";
import { settingsInitial } from "@/constants";
// import { CreateDatabase } from "../CreateDatabase";

interface Props {
  vscode: any;
  settings: Partial<Settings>;
  setSettings: (settings: Partial<Settings>) => void;
  dbNamesAndCollections: DatabaseCollection[] | undefined;
  setError: (value: string | undefined) => void;
}

export const Sidebar = ({
  setSettings,
  vscode,
  dbNamesAndCollections,
  setError,
  settings,
}: Props) => {
  const [url, setUrl] = useState<string | undefined>(settingsInitial.url);

  const [selectedAccordion, setSelectedAccordion] = useState<
    string | undefined
  >(undefined);
  const [selectedCollection, setSelectedCollection] = useState<
    string | undefined
  >(undefined);
  const sendMOngoDbUrlMessage = useCallback(() => {
    if (url) {
      vscode?.postMessage({
        command: "MongoDbUrl",
        url,
      });
    }
  }, [url]);
  useEffect(() => {
    sendMOngoDbUrlMessage();
  }, [sendMOngoDbUrlMessage]);

  const isSelected = useCallback(
    (collection: string) => {
      return collection === (selectedCollection ?? settings.collectionName);
    },
    [selectedCollection, settings.collectionName]
  );

  useEffect(() => {
    if (settings.url) {
      setUrl(settings.url);
    }
  }, [settings.url]);

  const getDbAndCol = useMemo(() => {
    let dbNameIndex = 0;
    if (dbNamesAndCollections) {
      dbNamesAndCollections.forEach((entry, index) => {
        if (entry[settings.dbName as string]) {
          dbNameIndex = index;
        }
      });
    }

    return { dbNameIndex };
  }, [settings.dbName, JSON.stringify(dbNamesAndCollections)]);

  return (
    <div>
      <Card
        className={` overflow-y-scroll h-full flex w-72 flex-col items-center rounded-none border-b-0 border-l-0 border-r border-t-0 p-4 shadow-none`}
      >
        <div className="mb-3 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <Label>MongoDB URL</Label>
            <div className="flex items-center space-x-2">
              <Sun size={16} />
              <Switch
                className="text-gray-200"
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSettings({ theme: "vs-dark" });
                  } else {
                    setSettings({ theme: "vs-light" });
                  }
                }}
                checked={settings.theme === "vs-dark"}
              />
              <Moon size={16} />
            </div>
          </div>
          <div className="flex flex-col w-full items-center justify-between space-y-3">
            <Input
              value={url}
              className={`h-8 rounded-sm w-full`}
              placeholder="MongoDb URL"
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button
              onClick={() => {
                setSettings({ url });
                vscode.postMessage({
                  command: "MongoDbUrl",
                  url,
                });
                setError(undefined);
              }}
              className="w-full"
              variant="secondary"
            >
              Apply
            </Button>
          </div>
        </div>
        {/* <div className="w-full flex items-center">
          <CreateDatabase vscode={vscode} />
        </div> */}
        <CardHeader className="text-left w-full p-0 text-lg mb-3">
          Database List
        </CardHeader>
        <Accordion
          type="single"
          value={selectedAccordion ?? `item-${getDbAndCol.dbNameIndex}`}
          collapsible
          className="w-full"
          onValueChange={(value) => setSelectedAccordion(value)}
        >
          {dbNamesAndCollections?.map((db, id) => (
            <AccordionItem
              key={id}
              className="border-none"
              value={`item-${id}`}
            >
              <AccordionTrigger
                className="hover:opacity-25 p-2 mb-3"
                onClick={() => {
                  setSettings({
                    dbName: Object.keys(db)[0],
                  });
                }}
              >
                <div className="flex items-center space-x-2">
                  <Database size={18} />
                  <Label className="cursor-pointer">{Object.keys(db)[0]}</Label>
                </div>
              </AccordionTrigger>
              {db?.[Object.keys(db)?.[0]]?.map((collectionName) => (
                <AccordionContent id={collectionName}>
                  <Button
                    className={`w-full justify-start ${
                      isSelected(collectionName)
                        ? "bg-gray-600 text-gray-50"
                        : ""
                    } hover:opacity-25 space-x-2 ml-3`}
                    variant="ghost"
                    onClick={() => {
                      setSettings({
                        collectionName,
                      });
                      setSelectedCollection(collectionName);
                    }}
                  >
                    <Folder size={18} />
                    <Label className="cursor-pointer">{collectionName}</Label>
                  </Button>
                </AccordionContent>
              ))}
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
};
