import Analytics from "analytics";
// @ts-ignore
import googleAnalytics from "@analytics/google-analytics";

export const useGoogleAnalytics = () => {
  const analytics = Analytics({
    app: "Mongo Playground",
    plugins: [
      googleAnalytics({
        measurementIds: ["G-0BJ1PR8T5L"],
      }),
    ],
  });

  const handleEditorChange = () => {
    analytics?.track("editor_changed", {
      value: true,
    });
  };

  const handleConnectToDb = () => {
    analytics?.track("connect_to_db", { value: true });
  };

  const handleCopy = () => {
    analytics?.track("copy", { value: true });
  };

  const handleExport = () => {
    analytics?.track("export_results", {
      value: true,
    });
  };

  const handleSavePipeline = () => {
    analytics?.track("pipeline_saved", {
      value: true,
    });
  };

  return {
    handleEditorChange,
    handleConnectToDb,
    handleCopy,
    handleExport,
    handleSavePipeline,
    analytics,
  };
};
