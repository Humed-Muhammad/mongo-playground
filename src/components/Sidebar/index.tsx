import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import { settingsInitial, themeBGColor } from "@/constants";

interface Props {
  vscode: any;
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
  dbNamesAndCollections: DatabaseCollection[] | undefined;
  setError: Dispatch<SetStateAction<string | undefined>>;
}

export const Sidebar = ({
  setSettings,
  vscode,
  dbNamesAndCollections,
  setError,
  settings,
}: Props) => {
  const [url, setUrl] = useState(settingsInitial.url);
  const [selectedCollection, setSelectedCollection] = useState<
    string | undefined
  >(undefined);
  useEffect(() => {
    vscode?.postMessage({
      command: "MongoDbUrl",
      url,
    });
  }, []);

  const isSelected = useCallback(
    (collection: string) => {
      return collection === (selectedCollection ?? settings.collectionName);
    },
    [selectedCollection, settings.collectionName]
  );

  useEffect(() => {
    setUrl(settings.url);
  }, [settings.url]);

  const getDbAndCol = useMemo(() => {
    let dbNameIndex = 0;
    if (dbNamesAndCollections) {
      dbNamesAndCollections.forEach((entry, index) => {
        if (entry[settings.dbName]) {
          dbNameIndex = index;
        }
      });
    }

    return { dbNameIndex };
  }, [settings.dbName, JSON.stringify(dbNamesAndCollections)]);

  return (
    <div>
      <Card
        className={` overflow-y-scroll h-full flex w-72 flex-col items-center rounded-none border-b-0 border-l-0 border-r border-t-0 border-r-slate-600 ${themeBGColor(
          settings
        )} p-4 shadow-none`}
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
                    setSettings((prev) => ({ ...prev, theme: "vs-dark" }));
                  } else {
                    setSettings((prev) => ({ ...prev, theme: "vs-light" }));
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
              className={`h-8 rounded-sm ${
                settings.theme === "vs-dark" ? "bg-gray-300" : "bg-gray-400"
              } text-gray-800`}
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
                setError(undefined);
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
          defaultValue={`item-${getDbAndCol.dbNameIndex}`}
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
                  setSettings((prev) => ({
                    ...prev,
                    dbName: Object.keys(db)[0],
                  }))
                }
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
                        ? "bg-gray-200 text-gray-600"
                        : ""
                    } hover:opacity-25 space-x-2`}
                    variant="ghost"
                    onClick={() => {
                      setSettings((prev) => ({
                        ...prev,
                        collectionName,
                      }));
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
