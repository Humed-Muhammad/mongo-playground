import { Dispatch, SetStateAction } from "react";
import { Card } from "../ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "../ui/accordion";
import { Settings } from "@/types";
import { Button } from "../ui/button";

interface Props {
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
}

export const Sidebar = ({ setSettings }: Props) => {
  return (
    <div>
      <Card className="h-full flex w-64 flex-col items-center rounded-none border-b-0 border-l-0 border-r border-t-0 border-r-slate-600 bg-[#1E1E1E] p-4     text-white shadow-none">
        <Accordion type="single" className="w-full">
          <AccordionItem className="border-none" value="item-1">
            <AccordionTrigger
              onClick={() =>
                setSettings((prev) => ({ ...prev, dbName: "appDb" }))
              }
            >
              appDb
            </AccordionTrigger>
            <AccordionContent>
              <Button
                className="w-full justify-start hover:opacity-25"
                variant="ghost"
                onClick={() =>
                  setSettings((prev) => ({ ...prev, collectionName: "orders" }))
                }
              >
                orders
              </Button>
            </AccordionContent>
            <AccordionContent>orderItems</AccordionContent>
            <AccordionContent>test</AccordionContent>
          </AccordionItem>
          <AccordionItem className="border-none" value="item-2">
            <AccordionTrigger
              onClick={() =>
                setSettings((prev) => ({ ...prev, dbName: "test" }))
              }
            >
              test
            </AccordionTrigger>
            <AccordionContent>
              <Button
                className="w-full justify-start hover:opacity-25"
                variant="ghost"
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    collectionName: "inventory",
                  }))
                }
              >
                inventory
              </Button>
            </AccordionContent>
            <AccordionContent>orders</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
};
