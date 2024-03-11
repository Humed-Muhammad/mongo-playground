import Editor from "@monaco-editor/react";
import "./global.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { DatabaseCollection, PipelineStoreType, Settings } from "./types";
import { Sidebar } from "./components/Sidebar";
import { Button } from "./components/ui/button";
import {
  Copy,
  FileJson,
  FileSpreadsheet,
  FolderDown,
  Save,
} from "lucide-react";
import {
  settingsInitial,
  suggestions,
  themeBGColor,
  themeTextColor,
} from "./constants";
import { Card } from "./components/ui/card";
import { Label } from "./components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { Switch } from "./components/ui/switch";

//@ts-ignore
const vscode = acquireVsCodeApi();

function App() {
  const editorRef = useRef(null);

  const webViewSetting = localStorage.getItem("mongodbSettings");
  const database = localStorage.getItem("dbNameAndCollection");
  const localPipelineStore = localStorage.getItem("pipelineStore");
  const localAutoSave = localStorage.getItem("autoSave");

  const [dbNamesAndCollections, setDbNamesAndCollections] =
    useState<Array<DatabaseCollection>>();
  const [settings, setSettings] = useState<Settings>(settingsInitial);

  const [queryResults, setQueryResults] = useState<string>();
  const [pipelineStore, setPipelineStore] = useState<PipelineStoreType>({});
  const [autoSave, setAutoSave] = useState<boolean>(
    JSON.parse(localAutoSave ?? "false")
  );
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (database) {
      const parsedDb = JSON.parse(database);
      setDbNamesAndCollections(parsedDb);
    }
  }, []);

  useEffect(() => {
    if (localPipelineStore) {
      const parsedLocalPipelineStore = JSON.parse(localPipelineStore);
      setPipelineStore(parsedLocalPipelineStore);
    }
  }, []);

  useEffect(() => {
    if (webViewSetting) {
      const parsedSettings = JSON.parse(webViewSetting);
      setSettings(parsedSettings);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mongodbSettings", JSON.stringify(settings));
    vscode?.postMessage({
      command: "executeQuery",
      ...settings,
    });
  }, [JSON.stringify(settings)]);

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.command === "dbNameAndCollection") {
        setDbNamesAndCollections(message.dbNamesAndCollections);
        localStorage.setItem(
          "dbNameAndCollection",
          JSON.stringify(message.dbNamesAndCollections)
        );
      }
      if (message.command === "queryResults") {
        if (message.error) {
          setError(message.error);
        } else {
          setError(undefined);

          setQueryResults(JSON.stringify(message.results.slice(0, 20)));
        }
      }
    });

    return () => {
      window.removeEventListener("message", () => {
        console.info("Event Removed Because Component Unmounted");
      });
    };
  }, []);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleAggDidMount = (_editor: any, monaco: any) => {
    monaco.languages.registerCompletionItemProvider("json", {
      provideCompletionItems: () => {
        // Define your suggestion array
        const allSuggestions = suggestions(monaco);

        return {
          suggestions: allSuggestions.map((suggestion) => ({
            ...suggestion,
            insertText: `"${suggestion.label}":`,
          })),
        };
      },
    });
  };

  useEffect(() => {
    if (editorRef.current) {
      //@ts-ignore
      editorRef.current.getAction("editor.action.formatDocument").run();
      //@ts-ignore
      editorRef.current.setPosition({ lineNumber: 1, column: 1 });
    }
  }, [queryResults, editorRef]);

  function copyToClipboard() {
    navigator.clipboard
      .writeText(settings.query ?? "")
      .then(() => {
        vscode.postMessage({ command: "copySuccess" });
      })
      .catch((error) => {
        vscode.postMessage({ command: "copyError", error: error.message });
      });
  }

  const pipelineKey = useMemo(
    () => `${settings.dbName}-${settings.collectionName}`,
    [settings.collectionName, settings.dbName]
  );

  const savePipeline = (auto?: boolean) => {
    setPipelineStore((prev) => ({
      ...prev,
      [pipelineKey]: settings.query,
    }));
    if (!auto) {
      vscode.postMessage({ command: "pipelineSaved" });
    }
  };

  useEffect(() => {
    localStorage.setItem("pipelineStore", JSON.stringify(pipelineStore));
  }, [JSON.stringify(pipelineStore)]);

  useEffect(() => {
    if (autoSave) {
      savePipeline(autoSave);
    }
  }, [autoSave, settings.query]);

  const getQueryForDbCollection = useMemo(() => {
    const singlePipe = pipelineStore?.[pipelineKey];

    return singlePipe;
  }, [JSON.stringify(pipelineStore), pipelineKey]);

  return (
    <div className="w-screen flex justify-between h-screen overflow-x-hidden">
      <Sidebar
        dbNamesAndCollections={dbNamesAndCollections}
        vscode={vscode}
        setSettings={setSettings}
        settings={settings}
        setError={setError}
      />
      <div className="flex flex-grow justify-between h-full overflow-x-hidden relative">
        <div className="w-[55%]">
          <Card
            className={`w-full p-2 px-6 ${themeBGColor(
              settings
            )}  flex space-x-4 items-center order rounded-none  border-0`}
          >
            <div className="flex items-center space-x-2">
              <Label>Auto Save</Label>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>
            {!autoSave ? (
              <Button
                onClick={() => savePipeline()}
                variant="ghost"
                className={`top-4 h-auto space-x-1 right-2 p-2 rounded-sm ${themeTextColor(
                  settings
                )} hover:text-gray-500`}
              >
                <Label className="cursor-pointer">Save Pipeline</Label>{" "}
                <Save size={18} />
              </Button>
            ) : null}
            <Button
              onClick={copyToClipboard}
              variant="ghost"
              className={`top-4 h-auto space-x-1 right-2 p-2 rounded-sm ${themeTextColor(
                settings
              )} hover:text-gray-500`}
            >
              <Label className="cursor-pointer">Copy</Label> <Copy size={18} />
            </Button>
          </Card>
          <Editor
            height="100%"
            defaultLanguage="json"
            value={getQueryForDbCollection ?? settings.query}
            width="100%"
            theme={settings.theme}
            onChange={(query) => setSettings((prev) => ({ ...prev, query }))}
            options={{
              tabSize: 2,
              insertSpaces: true,
              formatOnPaste: true,
            }}
            onMount={handleAggDidMount}
          />

          {error && (
            <div className="absolute bottom-4 left-2 z-10 h-auto rounded overflow-y-scroll w-[52%] items-center p-3 bg-yellow-50 text-red-600 text-md">
              {error}
            </div>
          )}
        </div>

        <div className="w-[45%]">
          <Card
            className={`w-full p-2 px-6 ${themeBGColor(
              settings
            )}  flex justify-between items-center order rounded-none  border-0`}
          >
            <Label>Output</Label>
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="ghost"
                  className={`top-4 h-auto space-x-1 right-2 p-2 rounded-sm ${themeTextColor(
                    settings
                  )} hover:text-gray-500`}
                >
                  <Label className="cursor-pointer">Export</Label>{" "}
                  <FolderDown size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className={`w-auto p-3 flex flex-col ${themeBGColor(settings)}`}
              >
                <Button
                  onClick={() => {
                    vscode.postMessage({ command: "saveJSON", queryResults });
                  }}
                  variant="ghost"
                  className={`top-4 h-auto space-x-1 right-2 p-2 rounded-sm ${themeTextColor(
                    settings
                  )} hover:text-gray-500`}
                >
                  <Label className="cursor-pointer">JSON</Label>{" "}
                  <FileJson size={18} />
                </Button>
                <Button
                  onClick={() => {
                    vscode.postMessage({ command: "saveCSV", queryResults });
                  }}
                  variant="ghost"
                  className={`top-4 h-auto space-x-1 right-2 p-2 rounded-sm ${themeTextColor(
                    settings
                  )} hover:text-gray-500`}
                >
                  <Label className="cursor-pointer">CSV</Label>{" "}
                  <FileSpreadsheet size={18} />
                </Button>
              </PopoverContent>
            </Popover>
          </Card>
          <Editor
            value={queryResults}
            height="100%"
            defaultLanguage="json"
            defaultValue="[]"
            width="100%"
            theme={settings.theme}
            options={{
              lineNumbers: "off",
              // readOnly: true,
              tabSize: 2,
              insertSpaces: true,
            }}
            //@ts-ignore
            onMount={handleEditorDidMount}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
