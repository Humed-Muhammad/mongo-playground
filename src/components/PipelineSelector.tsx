import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AllPipelinesType, PipelineStoreType, Settings } from "@/types";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { themeBGColor } from "@/constants";

interface Props {
  options: AllPipelinesType[];
  settings: Partial<Settings>;
  pipelineStore: PipelineStoreType;
  pipelineKey: string;
  setSettings: (settings:Partial<Settings>) => void;
}

export function PipelineSelector({
  options,
  settings,
  pipelineStore,
  pipelineKey,
  setSettings,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (pipelineKey && pipelineStore) {
      const keyToUse = pipelineStore[pipelineKey];
      const queryValue = options?.find(
        (pipeline) => pipeline?.label === keyToUse
      )?.value;

      setValue(queryValue as string);
    }
  }, [JSON.stringify(pipelineStore), pipelineKey, JSON.stringify(options)]);

  React.useEffect(() => {
    setSettings({query: value ?? "[]" })
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-[200px] justify-between h-7 ${themeBGColor(settings)}`}
        >
          {value
            ? options?.find((pipeline) => pipeline?.value === value)?.label
            : "Select pipeline..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search pipeline..." className="h-9" />
          <CommandEmpty>No pipeline found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {options?.map((pipeline) => (
                <CommandItem
                  key={pipeline?.value}
                  value={pipeline?.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {pipeline?.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === pipeline?.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
