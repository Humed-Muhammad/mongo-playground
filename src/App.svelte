<script>
  import Editor from "./components/Editor.svelte";

  let settings = JSON.parse(localStorage.getItem("mongodbSettings") ?? "") ?? {
    url: "mongodb://localhost:27017",
    theme: "vs-dark",
    dbName: "test",
    collectionName: "orders",
    query: "[]",
  };
  let mongodbSettings;

  const handleSettingChange = (newSettings) => {
    settings = newSettings;
  };

  $: {
    mongodbSettings = JSON.parse(
      localStorage.getItem("mongodbSettings") || JSON.stringify(settings)
    );
  }

  $: {
    localStorage.setItem("mongodbSettings", JSON.stringify(settings));
  }
</script>

<Editor {settings} {handleSettingChange} />
