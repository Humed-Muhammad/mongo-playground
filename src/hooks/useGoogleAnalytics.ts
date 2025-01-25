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
    analytics?.track("Editor Changed", {
      value: true,
    });
  };

  const handleConnectToDb = () => {
    analytics?.track("Connect To DB", {
      value: true,
    });
  };

  const handleCopy = () => {
    analytics?.track("Copy", {
      value: true,
    });
  };

  const handleExport = () => {
    analytics?.track("Export Results", {
      value: true,
    });
  };

  const handleSavePipeline = () => {
    analytics?.track("Pipeline Saved", {
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
