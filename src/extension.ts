import * as vscode from "vscode";
import { executeAggregationQuery } from "./executeAggregationQuery";
import { MongoClient } from "mongodb";
import path from "path";

export function activate(context: vscode.ExtensionContext) {
  let panel: vscode.WebviewPanel | undefined = undefined;

  // Command to open the WebView panel
  let disposable = vscode.commands.registerCommand("mongoPlayground", () => {
    if (panel) {
      panel.reveal(vscode.ViewColumn.Two);
    } else {
      panel = vscode.window.createWebviewPanel(
        "mongodbWebView", // Unique ID for the panel
        "MongoDB Aggregation", // Title of the panel
        vscode.ViewColumn.One, // Display the panel in the second column
        {
          enableScripts: true, // Enable JavaScript in the WebView
        }
      );
      const scriptUri = panel.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(context.extensionPath, "dist", "bundle/main.js")
        )
      );
      const styleUri = panel.webview.asWebviewUri(
        vscode.Uri.file(
          path.join(context.extensionPath, "dist", "bundle/bundle.css")
        )
      );
      panel.webview.html = getWebviewContent(scriptUri, styleUri); // Set the HTML content for the WebView

      // Set the icon for the panel
      const iconPath = vscode.Uri.file(context.asAbsolutePath("icon.png"));
      panel.iconPath = iconPath;

      // Handle messages from the WebView
      panel.webview.onDidReceiveMessage(
        async (message) => {
          const aggregationQuery = message.query;
          const url = message?.url;
          const client = new MongoClient(url);
          await client.connect();

          const adminDb = client.db("admin");
          const databaseList = await adminDb.admin().listDatabases();
          const dbNamesAndCollections: Array<{ [dbName: string]: string[] }> =
            [];
          // const collectionNames: Array<string> = [];

          // databaseList.databases.forEach((db) => {
          //   dbNames.push(db.name);
          // });

          // Get the list of collections in each database
          for (const db of databaseList.databases) {
            const dbInstance = client.db(db.name);
            const collectionList = await dbInstance.listCollections().toArray();
            const collectionListName: Array<string> = [];
            collectionList.forEach((collection) => {
              collectionListName.push(collection.name);
            });

            dbNamesAndCollections.push({
              [db.name]: collectionListName,
            });
          }
          panel?.webview.postMessage({
            command: "dbNameAndCollection",
            dbNamesAndCollections,
          });

          if (message.command === "executeQuery") {
            executeAggregationQuery(
              client,
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
                // Handle error

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
  });

  context.subscriptions.push(disposable);
}

// HTML content for the WebView
function getWebviewContent(jsUrl: vscode.Uri, styleUri: vscode.Uri): string {
  return `
  <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Svelte + TS</title>
    <link rel="stylesheet" href="${styleUri}">
    </head>
    <body>
    <div id="app"></div>
    <script type="module" src="${jsUrl}"></script>
  </body>
</html>

  `;
  //   return `
  //   <!DOCTYPE html>
  // <html lang="en">
  //   <head>
  //     <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.27.0/min/vs/loader.js"></script>
  //     <script src="https://cdn.tailwindcss.com"></script>
  //     <style>
  //       .monaco-editor {
  //         width: 100% !important;
  //         height: 100% !important;
  //       }
  //     </style>
  //     <link
  //       href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css"
  //       rel="stylesheet"
  //     />
  //     <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>
  //   </head>
  //   <body id="body" class="relative h-screen w-full overflow-hidden bg-[#1E1E1E]">
  //     <div class="flex justify-between px-4 items-center">
  //       <h1 id="heading" class="m-3 ml-8 text-lg text-white">
  //         MongoDb Aggregation Playground
  //       </h1>
  //       <button
  //         id="setting"
  //         class="text-white flex items-center space-x-1 transition-all hover:text-gray-300 h-7 p-3"
  //       >
  //         <p>Setting</p>
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           class="icon icon-tabler icon-tabler-settings"
  //           width="24"
  //           height="24"
  //           viewBox="0 0 24 24"
  //           stroke-width="1.5"
  //           stroke="currentColor"
  //           fill="none"
  //           stroke-linecap="round"
  //           stroke-linejoin="round"
  //         >
  //           <path stroke="none" d="M0 0h24v24H0z" fill="none" />
  //           <path
  //             d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"
  //           />
  //           <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
  //         </svg>
  //       </button>
  //     </div>
  //     <div class="bg-transparent w-full h-full flex space-x-3 overflow-hidden">
  //       <div id="editorContainer" class="relative h-full w-1/2">
  //         <div
  //           id="errorContainer"
  //           class="hidden fixed bottom-4 z-10 h-auto p-3 rounded-xl overflow-y-scroll w-[45%] items-center p-3 bg-yellow-50 text-red-600 text-md"
  //         ></div>
  //       </div>
  //       <div id="result" class="h-full w-1/2"></div>
  //     </div>
  //     <!-- Modal -->
  //     <div
  //       id="modalEl"
  //       tabindex="-1"
  //       aria-hidden="true"
  //       class="absolute top-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
  //     >
  //       <div class="relative w-full max-w-2xl max-h-full">
  //         <div class="relative bg-gray-200 rounded-lg shadow dark:bg-gray-700">
  //           <div
  //             class="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-600"
  //           >
  //             <h3
  //               class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white"
  //             >
  //               Adjust Playground Settings
  //             </h3>
  //             <button
  //               type="button"
  //               class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
  //               id="closeModal"
  //             >
  //               <svg
  //                 class="w-3 h-3"
  //                 aria-hidden="true"
  //                 xmlns="http://www.w3.org/2000/svg"
  //                 fill="none"
  //                 viewBox="0 0 14 14"
  //               >
  //                 <path
  //                   stroke="currentColor"
  //                   stroke-linecap="round"
  //                   stroke-linejoin="round"
  //                   stroke-width="2"
  //                   d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
  //                 />
  //               </svg>
  //               <span class="sr-only">Close modal</span>
  //             </button>
  //           </div>
  //           <div class="p-6 space-y-6">
  //             <div>
  //               <label
  //                 for="mongodbUrl"
  //                 class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
  //                 >MongoDb Url</label
  //               >
  //               <input
  //                 type="text"
  //                 id="mongodbUrl"
  //                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  //                 placeholder="MongoDb URL"
  //                 required
  //               />
  //             </div>
  //             <div>
  //               <label
  //                 for="theme"
  //                 class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
  //                 >Select Playground Theme</label
  //               >
  //               <select
  //                 id="theme"
  //                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  //               >
  //                 <option selected value="vs-dark">Dark</option>
  //                 <option value="vs-light">Light</option>
  //               </select>
  //             </div>
  //             <div>
  //             <label
  //               for="dbName"
  //               class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
  //               >Select Database</label
  //             >
  //             <select
  //               id="dbName"
  //               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  //             >

  //             </select>
  //           </div>
  //           <div>
  //             <label
  //               for="collectionName"
  //               class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
  //               >Select Collection</label
  //             >
  //             <select
  //               id="collectionName"
  //               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  //             >

  //             </select>
  //           </div>
  //           </div>
  //           <div
  //             class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
  //           >
  //             <button
  //               id="apply"
  //               type="button"
  //               class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  //             >
  //               Apply
  //             </button>
  //             <button
  //               id="cancel"
  //               type="button"
  //               class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
  //             >
  //               Cancel
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //     <script>

  //       let settings = {
  //         url: "mongodb://localhost:27017",
  //         theme: "vs-dark",
  //         dbName: "test",
  //         collectionName: "orders",
  //         query: "[]"
  //       };
  //       const mongodbSettings = JSON.parse(
  //         localStorage.getItem("mongodbSettings") || JSON.stringify(settings)
  //       );

  //       const $modalElement = document.querySelector("#modalEl");

  //       const modalOptions = {
  //         placement: "center",
  //         backdrop: "dynamic",
  //         backdropClasses:
  //           "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40",
  //       };

  //       const modal = new Modal($modalElement, modalOptions);

  //       const body = document.getElementById("body");
  //       const heading = document.getElementById("heading");
  //       const settingButton = document.getElementById("setting");
  //       const closeModal = document.getElementById("closeModal");
  //       const cancelButton = document.getElementById("cancel");
  //       const mongodbUrlInput = document.getElementById("mongodbUrl");
  //       const themeSelector = document.getElementById("theme");
  //       const dbNameSelector = document.getElementById("dbName");
  //       const collectionNameSelector = document.getElementById("collectionName");
  //       const applyButton = document.getElementById("apply");

  //       const updateTheme = (theme) => {
  //         let bgColor = theme === "vs-light" ? "rgba(255,255,255)" : "#1E1E1E";
  //         let color = theme === "vs-light" ? "#1E1E1E" : "rgba(255,255,255)";
  //         body.style.backgroundColor = bgColor;
  //         settingButton.style.color = color;
  //         heading.style.color = color;
  //       };

  //       if (mongodbSettings) {
  //         mongodbUrlInput.value = mongodbSettings.url;
  //         themeSelector.value = mongodbSettings.theme;
  //         dbNameSelector.value = mongodbSettings.dbName;
  //         collectionNameSelector.value = mongodbSettings.collectionName;
  //         updateTheme(mongodbSettings.theme);
  //       }

  //       // OnSettingChange
  //       mongodbUrlInput.addEventListener("change", (event) => {
  //         const mongodbSettings = JSON.parse(
  //           localStorage.getItem("mongodbSettings") || JSON.stringify(settings)
  //         );
  //         settings = { ...mongodbSettings, url: event.target.value };

  //       });

  //       themeSelector.addEventListener("change", (event) => {
  //         const mongodbSettings = JSON.parse(
  //           localStorage.getItem("mongodbSettings") || JSON.stringify(settings)
  //         );
  //         settings = { ...mongodbSettings, theme: event.target.value };
  //       });
  //       // For dbName and collectionName update
  //       dbNameSelector.addEventListener("change", (event) => {
  //         const mongodbSettings = JSON.parse(
  //           localStorage.getItem("mongodbSettings") || JSON.stringify(settings)
  //         );

  //         settings = { ...mongodbSettings, dbName: event.target.value };
  //         localStorage.setItem("mongodbSettings", JSON.stringify(settings));
  //         createCollectionOptions(event.target.value)
  //         collectionNameSelector.value = mongodbSettings.collectionName;
  //       });
  //       collectionNameSelector.addEventListener("change", (event) => {
  //         const mongodbSettings = JSON.parse(
  //           localStorage.getItem("mongodbSettings") || JSON.stringify(settings)
  //           );
  //           settings = { ...mongodbSettings, collectionName: event.target.value };
  //           localStorage.setItem("mongodbSettings", JSON.stringify(settings));
  //       });

  //       settingButton.addEventListener("click", () => modal.show());
  //       closeModal.addEventListener("click", () => modal.hide());
  //       cancelButton.addEventListener("click", () => modal.hide());

  //       function provideCompletionItems(model, position) {
  //         const suggestions = [
  //           { label: "$abs", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$accumulator", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$add", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$addToSet", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$allElementsTrue", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$and", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$anyElementTrue", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$arrayElemAt", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$arrayToObject", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$asin", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$atan", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$atan2", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$avg", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$bedgeoIntersects", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$bgeoWithin", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$bin", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$bit", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$bsonSize", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$bucket", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$bucketAuto", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$ceil", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$cmp", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$concat", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$concatArrays", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$cond", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$convert", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$cos", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$dateFromParts", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$dateToParts", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$dateFromString", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$dateToString", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$dayOfMonth", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$dayOfWeek", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$dayOfYear", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$degreesToRadians", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$divide", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$each", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$elemMatch", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$exp", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$exists", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$expr", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$filter", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$first", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$floor", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$function", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$geoIntersects", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$geoWithin", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$group", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$gt", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$gte", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$hour", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$ifNull", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$in", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$indexOfArray", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$indexOfBytes", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$indexOfCP", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$isArray", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$isoDayOfWeek", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$isoWeek", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$isoWeekYear", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$jsonSchema", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$last", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$let", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$literal", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$ln", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$log", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$log10", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$lt", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$lte", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$ltrim", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$map", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$match", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$max", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$mergeObjects", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$meta", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$millisecond", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$minute", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$mod", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$month", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$multiply", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$ne", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$not", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$objectToArray", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$or", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$pow", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$push", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$project", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$range", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$reduce", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$regexFind", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$regexFindAll", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$regexMatch", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$replaceOne", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$replaceAll", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$reverseArray", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$round", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$rtrim", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$second", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$setDifference", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$setEquals", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$setIntersection", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$setIsSubset", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$setUnion", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$size", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$sin", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$slice", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$split", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$sqrt", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$stdDevPop", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$stdDevSamp", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$strcasecmp", kind: monaco.languages.CompletionItemKind},
  //           { label: "$substr", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$substrBytes", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$substrCP", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$subtract", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$sum", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$switch", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$tan", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$toBool", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$toDate", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$toDecimal", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$toDouble", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$toInt", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$toLong", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$toObjectId", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$toString", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$trim", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$trunc", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$type", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$unset", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$unwind", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$week", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$year", kind: monaco.languages.CompletionItemKind.Keyword },
  //           { label: "$zip", kind: monaco.languages.CompletionItemKind.Keyword }
  //         ];

  //         const wordRange = model.getWordAtPosition(position);
  //         const range = {
  //           startLineNumber: position.lineNumber,
  //           endLineNumber: position.lineNumber,
  //           startColumn: wordRange.startColumn,
  //           endColumn: wordRange.endColumn,
  //         };

  //         return {
  //           suggestions: suggestions.map((suggestion) => ({
  //             ...suggestion,
  //             range: range,
  //             insertText: \`"\${suggestion.label\}":\`,
  //           })),
  //         };
  //       }

  //       const createCollectionOptions = (dbName) => {
  //         collectionNameSelector.length = 0;
  //         const dbOptions = localStorage.getItem("dbNameAndCollection")
  //         const dbNamesAndCollections = JSON.parse(dbOptions)
  //         const collections = dbNamesAndCollections.filter(db => Object.keys(db)[0] === dbName)[0][dbName]
  //         collections.map(col => {
  //           const collectionOption = document.createElement("option");
  //           collectionOption.value = col;
  //           collectionOption.textContent = col;
  //           collectionNameSelector.appendChild(collectionOption)
  //         })
  //         collectionNameSelector.value = collections[0]
  //       }

  //       const vscode = acquireVsCodeApi();
  //       try {
  //         require.config({
  //           paths: {
  //             vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.27.0/min/vs",
  //           },
  //         });
  //         window.MonacoEnvironment = { getWorkerUrl: () => proxy };

  //         require(["vs/editor/editor.main"], () => {
  //           // Register the JSON language
  //           monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
  //             validate: true,
  //             schemas: [],
  //           });

  //           // Set the language configuration for JSON
  //           monaco.languages.setLanguageConfiguration("json", {
  //             comments: {
  //               lineComment: "//",
  //               blockComment: ["/*", "*/"],
  //             },
  //           });

  //           // Register the completion item provider for JSON
  //           monaco.languages.registerCompletionItemProvider("json", {
  //             provideCompletionItems: provideCompletionItems,
  //           });

  //           const editor = monaco.editor.create(
  //             document.getElementById("editorContainer"),
  //             {
  //               value: "",
  //               language: "json",
  //               theme: mongodbSettings.theme,
  //               automaticLayout: true,
  //               suggestOnTriggerCharacters: true,
  //               suggestSelection: "first",
  //               quickSuggestions: true,
  //               quickSuggestionsDelay: 100,
  //               contextmenu: true,
  //               wordBasedSuggestions: true,
  //               snippetSuggestions: "none",
  //               parameterHints: true,
  //               autoClosingBrackets: true,
  //               autoClosingQuotes: true,
  //               autoIndent: true,
  //               suggest: {
  //                 filterGraceful: true,
  //                 snippetsPreventQuickSuggestions: false,
  //                 localityBonus: true,
  //                 shareSuggestSelections: true,
  //                 showIcons: true,
  //               },
  //               suggestFontSize: 13,
  //               suggestLineHeight: 22,
  //             }
  //           );

  //           const editorTwo = monaco.editor.create(
  //             document.getElementById("result"),
  //             {
  //               value: "",
  //               language: "json",
  //               lineNumbers: "off", // Hide line numbers

  //               theme: mongodbSettings.theme,
  //             }
  //           );

  //           applyButton.addEventListener("click", () => {
  //             const setti = JSON.parse(
  //               localStorage.getItem("mongodbSettings")
  //             );
  //             localStorage.setItem("mongodbSettings", JSON.stringify({...settings, query: setti.query}));
  //             monaco.editor.setTheme(settings.theme);
  //             updateTheme(settings.theme);
  //             vscode.postMessage({
  //               command: "executeQuery",
  //               query: setti.query,
  //               url: setti.url,
  //               dbName: setti.dbName,
  //               collectionName: setti.collectionName
  //             });
  //             editorTwo.getAction("editor.action.formatDocument").run();
  //             modal.hide();
  //           });

  //           const errorContainer = document.getElementById("errorContainer");

  //           editor.updateOptions({
  //             tabSize: 2,
  //             insertSpaces: true,
  //           });

  //           editor.onDidChangeModelContent(() => {
  //             const setti = JSON.parse(
  //               localStorage.getItem("mongodbSettings") || JSON.stringify(settings)
  //             );
  //             const query = editor.getValue();
  //             const newUpdatedSettingWithQuery = {...setti, query}

  //             localStorage.setItem("mongodbSettings", JSON.stringify(newUpdatedSettingWithQuery))

  //             vscode.postMessage({
  //               command: "executeQuery",
  //               query,
  //               url: setti.url,
  //               dbName: setti.dbName,
  //               collectionName: setti.collectionName
  //             });
  //           });

  //           // Optional: Set the initial content of the editor
  //           editor.setValue(mongodbSettings.query??"[]");

  //           window.addEventListener("message", (event) => {
  //             const setti = JSON.parse(
  //               localStorage.getItem("mongodbSettings") || JSON.stringify(settings)
  //             );
  //             const message = event.data;
  //             if(message.command === "dbNameAndCollection"){
  //               dbNameSelector.length = 0;
  //               localStorage.setItem("dbNameAndCollection", JSON.stringify(message.dbNamesAndCollections));
  //               message.dbNamesAndCollections.map((database)=> {
  //                 const dbName = Object.keys(database)[0];
  //                 const dbNameOption = document.createElement("option");
  //                 dbNameOption.value = dbName;
  //                 dbNameOption.textContent = dbName;
  //                 dbNameSelector.appendChild(dbNameOption)

  //               })

  //               createCollectionOptions(setti.dbName)
  //               dbNameSelector.value = setti.dbName;
  //               collectionNameSelector.value = setti.collectionName
  //             }
  //             if (message.command === "queryResults") {
  //               if (message.error) {
  //                 errorContainer.style.display = "flex";
  //                 errorContainer.innerText = JSON.stringify(message.error);
  //               } else {
  //                 errorContainer.style.display = "none";
  //                 errorContainer.innerText = "";
  //                 editorTwo.setValue(JSON.stringify(message.results.slice(0, 20)));
  //               }

  //               editorTwo.getAction("editor.action.formatDocument").run();
  //             }
  //           });
  //         });
  //       } catch (e) {
  //         console.log(error);
  //       }
  //     </script>
  //   </body>
  // </html>

  //   `;
}
