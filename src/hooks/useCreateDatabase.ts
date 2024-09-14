type CreateDatabaseProps = {
  dataBaseName: string;
  url: string | undefined;
  vscode: any;
};
export const useCreateDatabase = ({
  dataBaseName,
  url,
  vscode,
}: CreateDatabaseProps) => {
  const createNewDatabaseMessage = () => {
    vscode.postMessage({
      command: "createNewDatabase",
      dataBaseName,
      url,
    });
  };
  return { createNewDatabaseMessage };
};
