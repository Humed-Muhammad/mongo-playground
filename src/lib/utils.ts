import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WorkspaceFolders {
  workspaceFolders: any;
  vscode: any;
}
export const checkWorkspace = ({
  workspaceFolders,
  vscode,
}: WorkspaceFolders) => {
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("No workspace opened.");
    return;
  }
};
