import Editor, { OnMount } from "@monaco-editor/react";
import "./global.css";

import { useEffect, useMemo, useRef } from "react";
import type { Settings } from "./types";
import { Sidebar } from "./components/Sidebar";
import { Button } from "./components/ui/button";
import {
  Copy,
  FileJson,
  FileSpreadsheet,
  FolderDown,
  Save,
} from "lucide-react";
import { suggestions, themeBGColor } from "./constants";
import { Card } from "./components/ui/card";
import { Label } from "./components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { Input } from "./components/ui/input";
import { PipelineSelector } from "./components/PipelineSelector";
import { suggestionsAutoFillObject } from "./constants/suggetionValues";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllPipelinesFiles,
  selectCurrentQuery,
  selectDbNamesAndCollections,
  selectError,
  selectPipelineName,
  selectPipelineStore,
  selectQueryResults,
  selectSettings,
} from "./mongoSlice/selector";
import { actions } from "./mongoSlice";
import { useEventListener } from "./hooks/useEventListener";

//@ts-ignore
const vscode = acquireVsCodeApi();

function App() {
  const editorRef = useRef(null);

  const dbNamesAndCollections = useSelector(selectDbNamesAndCollections);
  const allPipelinesFiles = useSelector(selectAllPipelinesFiles);
  const settings = useSelector(selectSettings);
  const queryResults = useSelector(selectQueryResults);
  const pipelineName = useSelector(selectPipelineName);
  const currentQuery = useSelector(selectCurrentQuery);
  const pipelineStore = useSelector(selectPipelineStore);
  const error = useSelector(selectError);
  const setSettings = (settings: Partial<Settings>) => {
    dispatch(actions.setSettings(settings));
  };
  const setError = (error: string | undefined) => {
    dispatch(actions.setError(error));
  };

  const dispatch = useDispatch();

  /**@EffectStart */
  useEffect(() => {
    vscode.postMessage({
      command: "getAllPipelines",
    });
    setSettings({ query: currentQuery });
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      //@ts-ignore
      editorRef.current.getAction("editor.action.formatDocument").run();
      //@ts-ignore
      editorRef.current.setPosition({ lineNumber: 1, column: 1 });
    }
  }, [queryResults, editorRef]);

  useEffect(() => {
    localStorage.setItem("mongodbSettings", JSON.stringify(settings));
    vscode?.postMessage({
      command: "executeQuery",
      ...settings,
    });
  }, [JSON.stringify(settings)]);
  useEventListener();

  useEffect(() => {
    localStorage.setItem("pipelineStore", JSON.stringify(pipelineStore));
  }, [JSON.stringify(pipelineStore)]);

  /**@EffectEnd */

  /**@Handler **/
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleAggDidMount: OnMount = (_editor, monaco) => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: false,
      allowComments: true,
      trailingCommas: "ignore",
      schemaValidation: "ignore",
      schemaRequest: "ignore",
    });

    monaco.languages.registerCompletionItemProvider("json", {
      //@ts-ignore
      provideCompletionItems: () => {
        // Define your suggestion array
        const allSuggestions = suggestions(monaco);

        return {
          suggestions: allSuggestions.map((suggestion) => {
            let modifiedSuggestions =
              suggestionsAutoFillObject[
                suggestion.label as keyof typeof suggestionsAutoFillObject
              ] ?? `${suggestion.label}:`;

            return {
              ...suggestion,
              insertText: modifiedSuggestions,
            };
          }),
        };
      },
    });
  };

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
    dispatch(actions.setPipelineStore({ [pipelineKey]: pipelineName }));
    vscode.postMessage({
      command: "savePipeline",
      query: settings.query,
      name: pipelineName,
    });

    setTimeout(() => {
      vscode.postMessage({
        command: "getAllPipelines",
      });
    }, 100);

    if (!auto) {
      vscode.postMessage({ command: "pipelineSaved" });
    }
  };

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
            )}  flex flex-wrap space-x-4 items-center order rounded-none  border-0`}
          >
            <div>
              <Input
                className={`w-40 h-7`}
                placeholder="Pipeline name"
                value={pipelineName}
                onChange={(e) => {
                  dispatch(actions.setPipelineName(e.target.value));
                }}
              />
            </div>
            <div className="flex flex-col">
              {allPipelinesFiles ? (
                <PipelineSelector
                  settings={settings}
                  options={allPipelinesFiles}
                  pipelineStore={pipelineStore}
                  pipelineKey={pipelineKey}
                  setSettings={setSettings}
                />
              ) : null}
            </div>
            <Button
              onClick={() => {
                savePipeline();
              }}
              variant="ghost"
              className={`top-4 h-auto space-x-1 right-2 p-2 rounded-sm`}
            >
              <Label className="cursor-pointer">Save Pipeline</Label>{" "}
              <Save size={18} />
            </Button>

            <Button
              onClick={copyToClipboard}
              variant="ghost"
              className={`top-4 h-auto space-x-1 right-2 p-2 rounded-sm`}
            >
              <Label className="cursor-pointer">Copy</Label> <Copy size={18} />
            </Button>
          </Card>
          <Editor
            height="100%"
            defaultLanguage="json"
            value={settings.query}
            width="100%"
            theme={settings.theme}
            onChange={(query) => {
              setSettings({ query });
              localStorage.setItem("currentQuery", JSON.stringify(query));
            }}
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
                  className={`top-4 h-auto space-x-1 right-2 p-2 rounded-sm`}
                >
                  <Label className="cursor-pointer">Export</Label>{" "}
                  <FolderDown size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className={`w-auto p-3 flex flex-col`}>
                <Button
                  onClick={() => {
                    vscode.postMessage({ command: "saveJSON", queryResults });
                  }}
                  variant="ghost"
                  className={`top-4 h-auto space-x-1 right-2 p-2 rounded-sm`}
                >
                  <Label className="cursor-pointer">JSON</Label>{" "}
                  <FileJson size={18} />
                </Button>
                <Button
                  onClick={() => {
                    vscode.postMessage({ command: "saveCSV", queryResults });
                  }}
                  variant="ghost"
                  className={`top-4 h-auto space-x-1 right-2 p-2 rounded-sm`}
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
