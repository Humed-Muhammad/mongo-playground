import * as vscode from "vscode";
import { executeAggregationQuery } from "./executeAggregationQuery";
import { MongoClient } from "mongodb";
import path from "path";
import fs from "fs";
import { saveCsvFile, saveJsonFile } from "./helpers";
import { checkWorkspace } from "./lib/utils";
import { AllPipelinesType } from "./types";
import { createNewDatabase } from "./utils";

const getMongoClient = (url: string): Promise<MongoClient> => {
  try {
    const client = new MongoClient(url);
    return client.connect();
  } catch (error) {
    throw error;
  }
};

export function activate(context: vscode.ExtensionContext) {
  let panel: vscode.WebviewPanel | undefined = undefined;

  // Command to open the WebView panel
  let disposable = vscode.commands.registerCommand(
    "mongoPlayground",
    async () => {
      if (panel) {
        panel.reveal(vscode.ViewColumn.Two);
      } else {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        panel = vscode.window.createWebviewPanel(
          "mongodbWebView", // Unique ID for the panel
          "MongoDB Aggregation", // Title of the panel
          vscode.ViewColumn.One, // Display the panel in the second column
          {
            enableScripts: true, // Enable JavaScript in the WebView
            retainContextWhenHidden: true,
          }
        );
        vscode.window.terminals.forEach((terminal) => {
          terminal.hide();
        });
        // close the activity bar
        vscode.commands.executeCommand("workbench.action.closeSidebar");

        const scriptUri = panel.webview.asWebviewUri(
          vscode.Uri.file(
            path.join(context.extensionPath, "dist", "webview", "index.js")
          )
        );
        const styleUri = panel.webview.asWebviewUri(
          vscode.Uri.file(
            path.join(context.extensionPath, "dist", "webview", "index.css")
          )
        );

        panel.webview.html = getView(scriptUri, styleUri); // Set the HTML content for the WebView

        // Set the icon for the panel
        const iconPath = vscode.Uri.file(context.asAbsolutePath("icon.png"));
        panel.iconPath = iconPath;

        /**
         * The function `getAllSavedPipelines` reads pipeline files from a specified folder and sends
         * their content to a webview panel.
         */
        const getAllSavedPipelines = () => {
          const allPipelinesFiles: AllPipelinesType[] = [];
          checkWorkspace({ workspaceFolders, vscode });

          const userFolder = workspaceFolders?.[0].uri.fsPath;

          // Create the pipelines folder if it doesn't exist
          const pipelinesFolderPath = path.join(
            (userFolder ?? "") as string,
            "pipelines"
          );
          if (!fs.existsSync(pipelinesFolderPath)) {
            fs.mkdirSync(pipelinesFolderPath);
          }
          const files = fs.readdirSync(pipelinesFolderPath);
          files.map((file) => {
            const pipelineFilePath = path.join(pipelinesFolderPath, `${file}`);
            const content = fs.readFileSync(pipelineFilePath, {
              encoding: "utf8",
            });
            allPipelinesFiles.push({
              label: file?.substring(0, file?.lastIndexOf(".")),
              value: content,
            });
          });

          return allPipelinesFiles;
        };

        // Handle messages from the WebView
        let client: MongoClient;

        panel.webview.onDidReceiveMessage(
          async (message) => {
            if (message.command === "createNewDatabase") {
              createNewDatabase({
                dataBaseName: message.dataBaseName,
                url: message.url,
              });
            }

            if (message.command === "copySuccess") {
              vscode.window.showInformationMessage("Copied successfully!");
            }

            if (message.command === "getAllPipelines") {
              const allPipelinesFiles = getAllSavedPipelines();
              panel?.webview.postMessage({
                command: "allPipelinesFiles",
                allPipelinesFiles: allPipelinesFiles ?? [],
              });
            }

            if (message.command === "copyError") {
              vscode.window.showErrorMessage(`Failed to copy`);
            }

            if (message.command === "saveJSON") {
              saveJsonFile(message.queryResults);
            }
            if (message.command === "saveCSV") {
              saveCsvFile(message.queryResults);
            }

            // if (message.command === "pipelineSaved") {
            //   vscode.window.showInformationMessage(
            //     "Pipeline Saved Successfully!"
            //   );
            // }

            if (message.command === "savePipeline") {
              // Get the workspace folders

              checkWorkspace({ workspaceFolders, vscode });
              // Use the first workspace folder as the target folder
              //@ts-ignore
              const userFolder = workspaceFolders[0].uri.fsPath;
              const fileName = `${message.name}.json`;

              // Create the pipelines folder if it doesn't exist
              const pipelinesFolderPath = path.join(userFolder, "pipelines");
              if (!fs.existsSync(pipelinesFolderPath)) {
                fs.mkdirSync(pipelinesFolderPath);
              }

              const filePath = path.join(userFolder, "pipelines", fileName);

              fs.writeFile(filePath, message.query, (err) => {
                if (err) {
                  vscode.window.showErrorMessage(
                    `Failed to save file: ${err.message}`
                  );
                } else {
                  vscode.window.showInformationMessage(
                    `File saved to: ${filePath}`
                  );
                }
              });
            }

            if (message.command === "MongoDbUrl") {
              await vscode.window.withProgress(
                {
                  location: vscode.ProgressLocation.Notification,
                  cancellable: false,
                  title: "Connecting to MongoDB",
                },

                async () => {
                  if (message.command === "MongoDbUrl") {
                    await getMongoClient(message.url)
                      .then((mongoClient) => {
                        client = mongoClient;

                        vscode.window.showInformationMessage(
                          "Connected to MongoDB successfully!"
                        );
                      })
                      .catch((error) => {
                        console.error("MongoDB connection error:", error);
                        vscode.window.showErrorMessage(
                          `Failed to connect to MongoDB: ${error.message}\nStack: ${error.stack}`
                        );
                      });
                  }
                }
              );

              //@ts-ignore
              const adminDb = client?.db("admin");
              const databaseList = await adminDb?.admin()?.listDatabases();
              const dbNamesAndCollections: Array<{
                [dbName: string]: string[];
              }> = [];
              if (databaseList) {
                // Get the list of collections in each database
                for (const db of databaseList.databases) {
                  //@ts-ignore
                  const dbInstance = client?.db(db.name);
                  const collectionList = await dbInstance
                    .listCollections()
                    .toArray();
                  const collectionListName: Array<string> = [];
                  collectionList.forEach((collection) => {
                    collectionListName.push(collection.name);
                  });

                  dbNamesAndCollections.push({
                    [db.name]: collectionListName.sort((a, b) => {
                      if (a > b) {
                        return 1;
                      }
                      if (a < b) {
                        return -1;
                      }
                      return 0;
                    }),
                  });
                }
              }
              panel?.webview.postMessage({
                command: "dbNameAndCollection",
                dbNamesAndCollections: dbNamesAndCollections?.sort((a, b) => {
                  // Get the first database name from each object
                  const dbNameA = Object.keys(a)[0];
                  const dbNameB = Object.keys(b)[0];

                  // Compare the database names and sort alphabetically
                  if (dbNameA < dbNameB) {
                    return -1;
                  }
                  if (dbNameA > dbNameB) {
                    return 1;
                  }
                  return 0;
                }),
              });
            }

            if (message.command === "executeQuery") {
              const aggregationQuery = message.query;
              executeAggregationQuery(
                message.url,
                aggregationQuery,
                message.dbName,
                message.collectionName
              )
                .then((result) => {
                  // Send query results back to the WebView
                  panel?.webview.postMessage({
                    command: "queryResults",
                    results: result,
                  });
                })
                .catch((error) => {
                  panel?.webview.postMessage({
                    command: "queryResults",
                    error: error.message,
                  });
                });
            }
          },
          undefined,
          context.subscriptions
        );

        // Dispose the panel when it's closed
        panel.onDidDispose(
          () => {
            panel = undefined;
          },
          null,
          context.subscriptions
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

// HTML content for the WebView

function getView(js: vscode.Uri, css: vscode.Uri): string {
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Svelte + TS</title>
   <script type="module"  src="${js}"></script>
    <link rel="stylesheet"  href="${css}">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;
}
