import { actions } from "@/mongoSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useEventListener = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.command === "dbNameAndCollection") {
        dispatch(
          actions.setDbNamesAndCollections(message.dbNamesAndCollections)
        );
        localStorage.setItem(
          "dbNameAndCollection",
          JSON.stringify(message.dbNamesAndCollections)
        );
      }
      if (message.command === "queryResults") {
        if (message.error) {
          dispatch(actions.setError(message.error));
        } else {
          dispatch(actions.setError(undefined));
          // Apply pagination here if you want
          dispatch(actions.setQueryResults(JSON.stringify(message.results)));
        }
      }
      if (message.command === "allPipelinesFiles") {
        dispatch(actions.setAllPipelinesFiles(message.allPipelinesFiles));
      }
    });

    return () => {
      window.removeEventListener("message", () => {
        console.info("Event Removed Because Component Unmounted");
      });
    };
  }, []);
};
