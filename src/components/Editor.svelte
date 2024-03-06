<!-- <script>
  //   import type monaco from "monaco-editor";
  import { onMount } from "svelte";
  import { jsonWorker } from "monaco-editor/esm/vs/language/json/json.worker";
  //   import { jsonWorker } from "monaco-editor/esm/vs/language/json/json.worker";

  // import Sidebar from './Sidebar.svelte';
  //   import type { Settings } from "../types";

  // Props
  export let settings;
  export let handleSettingChange;

  let editorOne = null;
  let editorTwo = null;
  let editor;
  let editorResult;
  let Monaco;

  // @ts-ignore
  onMount(async () => {
    self.MonacoEnvironment = {
      getWorker: function (_moduleId, label) {
        return new jsonWorker();
      },
    };

    Monaco = await import("monaco-editor");
    editor = Monaco.editor.create(editorOne, {
      value: settings.query,
      language: "json",
      tabSize: 2,
      insertSpaces: true,
    });

    editor.onDidChangeModelContent(() => {
      const query = editor.getValue();

      if (handleSettingChange) handleSettingChange({ ...settings, query });

      // vscode.postMessage({
      //   command: "executeQuery",
      //   settings,
      // });
    });

    editorResult = Monaco.editor.create(editorTwo, {
      value: "[]",
      language: "json",
      lineNumbers: "off", // Hide line numbers
      theme: "vs-dark",
    });

    return () => {
      editor.dispose();
      editorResult.dispose();
    };
  });
</script> -->

<script>
  import { onMount } from "svelte";
  import * as monaco from "monaco-editor";

  export let language = "json";
  export let value = "[]";

  let editor;

  onMount(() => {
    const container = document.getElementById("monaco-editor");

    editor = monaco.editor.create(container, {
      value,
      language,
    });
  });

  function destroyEditor() {
    editor.dispose();
  }

  // Cleanup the editor when the component is destroyed
  onDestroy(destroyEditor);
</script>

<div id="monaco-editor" style="width: 100%; height: 400px;"></div>

<link
  rel="stylesheet"
  href="path/to/monaco-editor/min/vs/editor/editor.main.css"
/>

<!-- <div class="flex h-full w-full space-x-2 bg-[#1E1E1E]">
  <div class="flex flex-grow space-x-2 bg-[#1E1E1E]">
    <div bind:this={editorOne} style="height: 100vh; width: 50%;" />
    <div bind:this={editorTwo} style="height: 100vh; width: 50%;" />
  </div>
</div> -->
