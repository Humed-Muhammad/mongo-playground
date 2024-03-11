// import * as vscode from "vscode";

// export function saveJsonFile(
//   jsonData: string,
//   fileName: string
// ): Thenable<any> {
//   const options: vscode.SaveDialogOptions = {
//     defaultUri: vscode.Uri.file(fileName),
//     filters: {
//       "JSON Files": ["json"],
//     },
//   };

//   return vscode.window.showSaveDialog(options).then((uri) => {
//     if (uri) {
//       const workspaceEdit = new vscode.WorkspaceEdit();
//       workspaceEdit.createFile(uri, { ignoreIfExists: true });
//       workspaceEdit.insert(uri, new vscode.Position(0, 0), jsonData);
//       return vscode.workspace.applyEdit(workspaceEdit).then(() => {
//         // Refresh the VS Code workspace to prevent the file from automatically opening
//         return vscode.commands.executeCommand("workbench.action.files.revert");
//       });
//     }
//   });
// }

// export function saveCsvFile(jsonData: string, fileName: string): Thenable<any> {
//   const data = JSON.parse(jsonData);
//   const csvContent = convertJsonToCsv(data);
//   const options: vscode.SaveDialogOptions = {
//     defaultUri: vscode.Uri.file(fileName),
//     filters: {
//       "CSV Files": ["csv"],
//     },
//   };

//   return vscode.window.showSaveDialog(options).then((uri) => {
//     if (uri) {
//       const workspaceEdit = new vscode.WorkspaceEdit();
//       workspaceEdit.createFile(uri, { ignoreIfExists: true });
//       workspaceEdit.insert(uri, new vscode.Position(0, 0), csvContent);
//       workspaceEdit.insert(uri, new vscode.Position(0, 0), csvContent);
//       return vscode.workspace.applyEdit(workspaceEdit).then(() => {
//         // Refresh the VS Code workspace to prevent the file from automatically opening
//         return vscode.commands.executeCommand("workbench.action.files.revert");
//       });
//     }
//   });
// }

// function convertJsonToCsv(data: any[]): string {
//   const headers = Object.keys(data[0]);
//   const rows = data.map((obj) =>
//     headers.map((header) => obj[header]).join(",")
//   );
//   return `${headers.join(",")}\n${rows.join("\n")}`;
// }

// export function downloadFile(
//   content: string,
//   fileName: string,
//   mimeType: string
// ): void {
//   const blob = new Blob([content], { type: mimeType });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");

//   link.href = url;
//   link.download = fileName;
//   link.click();

//   URL.revokeObjectURL(url);
// }

import * as vscode from "vscode";
import * as fs from "fs";

export function saveJsonFile(jsonData: string): void {
  vscode.window
    .showSaveDialog({
      defaultUri: vscode.Uri.file("pipeline.json"),
      filters: {
        JSON: ["json"],
      },
    })
    .then((fileUri: vscode.Uri | undefined) => {
      if (fileUri) {
        const filePath = fileUri.fsPath;
        fs.writeFileSync(filePath, jsonData);
        vscode.window.showInformationMessage("JSON file saved successfully.");
      }
    });
}

export function saveCsvFile(jsonData: string): void {
  const data = JSON.parse(jsonData);
  const csvContent = convertJsonToCsv(data);
  vscode.window
    .showSaveDialog({
      defaultUri: vscode.Uri.file("pipeline.csv"),
      filters: {
        CSV: ["csv"],
      },
    })
    .then((fileUri: vscode.Uri | undefined) => {
      if (fileUri) {
        const filePath = fileUri.fsPath;
        fs.writeFileSync(filePath, csvContent);
        vscode.window.showInformationMessage("CSV file saved successfully.");
      }
    });
}

function convertJsonToCsv(data: any[]): string {
  const headers = Object.keys(data[0]);
  const rows = data.map((obj) =>
    headers.map((header) => obj[header]).join(",")
  );
  return `${headers.join(",")}\n${rows.join("\n")}`;
}
