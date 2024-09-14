import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateDatabase } from "@/hooks/useCreateDatabase";
import { selectSettings } from "@/mongoSlice/selector";
import { useState } from "react";
import { useSelector } from "react-redux";

type Props = {
  vscode: any;
};
export function CreateDatabase({ vscode }: Props) {
  const [dataBaseName, setDataBaseName] = useState("");
  const setting = useSelector(selectSettings);
  const { createNewDatabaseMessage } = useCreateDatabase({
    dataBaseName,
    url: setting.url,
    vscode,
  });
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Create Database</Button>
      </PopoverTrigger>
      <PopoverContent
        className={`w-80 ${setting.theme === "vs-dark" ? "dark" : ""}`}
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Database name</h4>
            <p className="text-sm text-muted-foreground">
              Give a name to your database.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Input
                value={dataBaseName}
                onChange={(e) => setDataBaseName(e.target.value)}
                className="col-span-2 h-8 w-full"
                placeholder="Database name"
              />
            </div>
            <Button onClick={createNewDatabaseMessage} className="w-full">
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
