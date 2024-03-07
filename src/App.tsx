import Editor from "@monaco-editor/react";
import "./global.css";

import { useEffect, useState } from "react";
import { Settings } from "./types";
import { Sidebar } from "./components/Sidebar";

//@ts-ignore
const vscode = acquireVsCodeApi();

function App() {
  const webViewSetting = localStorage.getItem("mongodbSettings");
  const database = localStorage.getItem("dbNameAndCollection");
  const [dbNamesAndCollections, setDbNamesAndCollections] = useState(
    JSON.stringify(database ?? "")
  );
  const [settings, setSettings] = useState<Settings>(
    JSON.parse(webViewSetting ?? "{}")
  );

  useEffect(() => {
    localStorage.setItem("mongodbSettings", JSON.stringify(settings));
    vscode?.postMessage({
      command: "executeQuery",
      ...settings,
    });
  }, [JSON.stringify(settings)]);

  useEffect(() => {
    window.addEventListener("message", (event) => {
      // const setti = JSON.parse(
      //   localStorage.getItem("mongodbSettings") || JSON.stringify(settings)
      // );
      const message = event.data;
      if (message.command === "dbNameAndCollection") {
        console.log(message.dbNamesAndCollections);
        setDbNamesAndCollections(dbNamesAndCollections);
        localStorage.setItem(
          "dbNameAndCollection",
          JSON.stringify(message.dbNamesAndCollections)
        );
        // message.dbNamesAndCollections.map((database)=> {
        //   const dbName = Object.keys(database)[0];
        //   const dbNameOption = document.createElement("option");
        //   dbNameOption.value = dbName;
        //   dbNameOption.textContent = dbName;
        //   dbNameSelector.appendChild(dbNameOption)

        // })

        // createCollectionOptions(setti.dbName)
        // dbNameSelector.value = setti.dbName;
        // collectionNameSelector.value = setti.collectionName
      }
      // if (message.command === "queryResults") {
      //   if (message.error) {
      //     errorContainer.style.display = "flex";
      //     errorContainer.innerText = JSON.stringify(message.error);
      //   } else {
      //     errorContainer.style.display = "none";
      //     errorContainer.innerText = "";
      //     editorTwo.setValue(JSON.stringify(message.results.slice(0, 20)));
      //   }

      //   editorTwo.getAction("editor.action.formatDocument").run();
      // }
      // });
    });
    return () => {
      window.removeEventListener("message", () => {
        console.log("Event Removed Because Component Unmounted");
      });
    };
  }, []);

  return (
    <div className="w-screen flex justify-between h-screen overflow-x-hidden">
      <Sidebar setSettings={setSettings} settings={settings} />
      <div className="flex flex-grow justify-between h-full overflow-x-hidden">
        <Editor
          height="100%"
          defaultLanguage="json"
          defaultValue={settings.query}
          // width="50%"
          className="flex-grow"
          theme={settings.theme}
          onChange={(query) => setSettings((prev) => ({ ...prev, query }))}
          options={{
            tabSize: 2,
            insertSpaces: true,
          }}
        />
        <Editor
          height="100%"
          defaultLanguage="json"
          defaultValue="[]"
          className="flex-grow"
          theme={settings.theme}
          options={{
            lineNumbers: "off",
            readOnly: true,
            tabSize: 2,
            insertSpaces: true,
          }}
        />
      </div>
    </div>
  );
}

export default App;
