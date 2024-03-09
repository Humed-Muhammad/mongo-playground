import Editor from "@monaco-editor/react";
import "./global.css";

import { useEffect, useRef, useState } from "react";
import { DatabaseCollection, Settings } from "./types";
import { Sidebar } from "./components/Sidebar";
import { Button } from "./components/ui/button";
import { Copy } from "lucide-react";

//@ts-ignore
const vscode = acquireVsCodeApi();

function App() {
  const editorRef = useRef(null);
  const webViewSetting = localStorage.getItem("mongodbSettings");
  const database = localStorage.getItem("dbNameAndCollection");
  const [dbNamesAndCollections, setDbNamesAndCollections] = useState<
    Array<DatabaseCollection>
  >(JSON.parse(database ?? ""));
  const [settings, setSettings] = useState<Settings>(
    JSON.parse(webViewSetting ?? "{}")
  );

  const [queryResults, setQueryResults] = useState<string>();
  const [error, setError] = useState<string | undefined>();

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
        setDbNamesAndCollections(dbNamesAndCollections);
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

  useEffect(() => {
    if (editorRef.current) {
      //@ts-ignore
      editorRef.current.getAction("editor.action.formatDocument").run();
      //@ts-ignore
      editorRef.current.setPosition({ lineNumber: 1, column: 1 });
    }
  }, [queryResults, editorRef]);

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
        <Editor
          height="100%"
          defaultLanguage="json"
          defaultValue={settings.query}
          width="55%"
          // className="flex-grow"
          theme={settings.theme}
          onChange={(query) => setSettings((prev) => ({ ...prev, query }))}
          options={{
            tabSize: 2,
            insertSpaces: true,
            formatOnPaste: true,
          }}
        />

        <Button variant="ghost" className="absolute top-4 right-2">
          <Copy className="text-white" size={18} />
        </Button>
        {error && (
          <div className="absolute bottom-4 left-2 z-10 h-auto rounded overflow-y-scroll w-[54%] items-center p-3 bg-yellow-50 text-red-600 text-md">
            {error}
          </div>
        )}

        <Editor
          value={queryResults}
          height="100%"
          defaultLanguage="json"
          defaultValue="[]"
          width="45%"
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
  );
}

export default App;
