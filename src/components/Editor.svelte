<!-- <script>
  import * as monaco from "monaco-editor";
  import { onMount } from "svelte";

  // let editorOne = null;
  // let editorTwo = null;
  // let editor;
  // let editorResult;
  // let Monaco;

  // // @ts-ignore
  // onMount(async () => {
  //   self.MonacoEnvironment = {
  //     getWorker: function (_moduleId, label) {
  //       return new jsonWorker();
  //     },
  //   };

  //   Monaco = await import("monaco-editor");
  //   editor = Monaco.editor.create(editorOne, {
  //     value: "[]",
  //     language: "json",
  //     tabSize: 2,
  //     insertSpaces: true,
  //     theme: "vs-dark",
  //   });

  //   editorResult = Monaco.editor.create(editorTwo, {
  //     value: "[]",
  //     language: "json",
  //     lineNumbers: "off", // Hide line numbers
  //     theme: "vs-dark",
  //   });

  //   return () => {
  //     editor.dispose();
  //     editorResult.dispose();
  //   };
  // });
  onMount(() => {
    const container = document.getElementById("editor-container");

    monaco.editor.create(container, {
      value: "", // Set the initial value of the editor
      language: "json", // Specify the language mode
    });

    // Create an instance of the JSON worker
    const worker = new Worker(
      monaco.worker.create((ctx) => {
        return new monaco.jsonWorker(ctx);
      })
    );

    // Assign the JSON worker to the editor
    monaco.languages.json.jsonDefaults.setWorker(worker);
  });
</script>

<div id="editor-container"></div> -->

<script>
  import { onMount } from "svelte";
  import * as jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
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
    editor = Monaco?.editor.create(editorOne, {
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
</script>

<div
  style="width: 100vw; height: 100vh;"
  class="flex h-full w-full space-x-2 bg-[#1E1E1E]"
>
  <div
    style="width: 100vw; height: 100vh;"
    class="flex flex-grow space-x-2 bg-[#1E1E1E]"
  >
    <div bind:this={editorOne} style="height: 100vh; width: 50%;" />
    <div bind:this={editorTwo} style="height: 100vh; width: 50%;" />
  </div>
</div>
